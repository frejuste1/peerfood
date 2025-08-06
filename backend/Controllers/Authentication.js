import AppError from '../Utils/AppError.js';
import ResponseHandler from '../Utils/ResponseHandler.js';
import { loginSchema } from '../Utils/ValidationSchemas.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Account from '../Models/Account.js';

class Authentication {
    /**
     * Generate a JWT token for authentication.
     * @param {Object} account - Account data (id, username, type).
     * @returns {string} JWT token.
     */
    static generateToken(account) {
        return jwt.sign(
            {
                id: account.id,
                username: account.username,
                role: account.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
    }

    /**
     * Handle user registration.
     */
    static async Register(req, res) {
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));
            return ResponseHandler.validationError(res, errors);
        }

        try {
            const existingUser = await Account.findOne(value.username);

            if (existingUser) {
                return ResponseHandler.error(res, 'Username already exists', 409);
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(value.password, salt);

            const account = { 
                customer: value.customerId,
                username: value.username, 
                mdpasse: hashedPassword,
                role: value.role || 'Student'
            };

            const accountId = await Account.Create(account);

            return ResponseHandler.success(res, { accountId }, 'Account created successfully', 201);
        } catch (err) {
            return ResponseHandler.error(res, 'Error creating account', 500, err);
        }
    }

    /**
     * Handle user login.
     */
    static async Login(req, res) {
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));
            return ResponseHandler.validationError(res, errors);
        }

        try {
            const account = await Account.findOne(value.username);
            
            if (!account) {
                return ResponseHandler.error(res, 'Invalid credentials', 401);
            }

            const isPasswordValid = await bcrypt.compare(value.password, account.mdpasse);
            
            if (!isPasswordValid) {
                return ResponseHandler.error(res, 'Invalid credentials', 401);
            }

            const token = Authentication.generateToken(account);

            res.cookie('token', token, { 
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
            
            return ResponseHandler.success(res, {
                token,
                user: {
                    id: account.accountId,
                    username: account.username,
                    role: account.role
                }
            }, 'Login successful');
        } catch (err) {
            return ResponseHandler.error(res, 'Error during login', 500, err);
        }
    }

    static async me(req, res) {
        try {
            if (!req.user) {
                return ResponseHandler.unauthorized(res, 'No user authenticated');
            }

            return ResponseHandler.success(res, req.user, 'User information retrieved successfully');
        } catch (err) {
            return ResponseHandler.error(res, 'Error retrieving user information', 500, err);
        }
    }

    static async Logout(req, res) {
        try {
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });
            
            return ResponseHandler.success(res, null, 'Logout successful');
        } catch (err) {
            return ResponseHandler.error(res, 'Error during logout', 500, err);
        }
    }

    /**
     * ✅ CORRECTION: Méthode me() corrigée avec les bons paramètres
     * Get current user information
     */
    static async me(req, res) {
        try {
            // req.user devrait être défini par un middleware d'authentification
            if (!req.user) {
                return res.status(401).json({
                    message: '❌ No user authenticated',
                });
            }

            return res.status(200).json({
                message: '✅ User logged in',
                user: req.user,
            });
        } catch (err) {
            next(new AppError('Error retrieving user information', 500));
        }
    }

    /**
     * Middleware pour vérifier l'authentification JWT
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    static verifyToken(req, res, next) {
        const token = req.cookies?.token || 
                     (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') 
                      ? req.headers.authorization.slice(7) 
                      : null);
        
        if (!token) {
            return ResponseHandler.unauthorized(res, 'Access denied. No token provided.');
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            req.user = {
                id: decoded.id,
                username: decoded.username,
                role: decoded.role
            };
            
            next();
        } catch (err) {
            let message = '❌ Invalid token';
            
            if (err.name === 'TokenExpiredError') {
                message = '❌ Token has expired';
            } else if (err.name === 'JsonWebTokenError') {
                message = '❌ Malformed token';
            }
            
            return ResponseHandler.unauthorized(res, message);
        }
    }
}

export default Authentication;