import AppError from '../Utils/AppError.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Joi from 'joi';
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
        const { customerId, username, mdpasse } = req.body;

        // 🛑 Validation des données d'entrée
        if (!customerId) {
            console.log('customerId is missing:', customerId);
            return res.status(400).json({
                message: '❌ Le champ customerId est requis.',
            });
        }
        if (!username) {
            console.log('username is missing:', username);
            return res.status(400).json({
                message: '❌ Le champ username est requis.',
            });
        }
        if (!mdpasse) {
            console.log('password is missing:', mdpasse);
            return res.status(400).json({
                message: '❌ Le champ password est requis.',
            });
        }

        try {
            // 🔎 Vérifier si l'utilisateur existe déjà (insensible à la casse)
            const existingUser = await Account.findOne(username);

            // ✅ CORRECTION: La logique était inversée
            if (existingUser) { // Si l'utilisateur existe déjà
                return res.status(409).json({
                    message: '⚠️ Username already exists',
                });
            }

            // 🔐 Hachage sécurisé du mot de passe
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(mdpasse, salt);

            // 💾 Création du compte avec le mot de passe sécurisé
            const account = { 
                customer: customerId,
                username: username, 
                mdpasse: hashedPassword,
                role: 'Student' // Valeur par défaut
            };

            const accountId = await Account.Create(account);

            return res.status(201).json({
                message: '✅ Account created successfully',
                accountId,
            });
        } catch (err) {
            next(new AppError('Error creating account', 500));
        }
    }

    /**
     * Handle user login.
     */
    static async Login(req, res) {
        const { username, password } = req.body;

        // 🛑 Validation des données 
        if (!username || !password) {
            return res.status(400).json({
                message: '❌ All fields are required',
            });
        }

        try {
            // ✅ CORRECTION: Récupérer le compte uniquement par username
            const account = await Account.findOne(username);
            
            if (!account) {
                return res.status(404).json({
                    message: `😓 No account found with the username ${username}`,
                });
            }

            // ✅ CORRECTION: Vérifier le mot de passe avec bcrypt
            const isPasswordValid = await bcrypt.compare(password, account.mdpasse);
            
            if (!isPasswordValid) {
                return res.status(401).json({
                    message: '❌ Invalid password',
                });
            }

            // 🔑 Generate token
            const token = Authentication.generateToken(account);

            // ✅ CORRECTION: Ajouter la réponse avec le token
            // En développement, secure doit être false pour HTTP, true uniquement en production
            res.cookie('token', token, { 
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production', // Sécurisé uniquement en production
                sameSite: 'strict'
            });
            
            return res.status(200).json({
                message: '✅ Login successful',
                token: token,
                user: {
                    id: account.id,
                    username: account.username,
                    type: account.type
                }
            });
        } catch (err) {
            next(new AppError('Error during login', 500));
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
        // Récupérer le token depuis les cookies ou l'en-tête Authorization
        const token = req.cookies?.token || 
                     (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') 
                      ? req.headers.authorization.slice(7) 
                      : null);
        
        console.log('🔍 Cookies reçus:', req.cookies);
        console.log('🔑 Token extrait:', token);

        // Vérifier si le token existe
        if (!token) {
            return res.status(401).json({
                message: '❌ Access denied. No token provided.',
                error: 'NO_TOKEN'
            });
        }

        try {
            // Vérifier et décoder le token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Ajouter les infos utilisateur à la requête
            req.user = {
                id: decoded.id,
                username: decoded.username,
                type: decoded.type
            };
            
            // Passer au middleware suivant
            next();
        } catch (err) {
            // Gérer les différents types d'erreurs JWT
            let message = '❌ Invalid token';
            let errorCode = 'INVALID_TOKEN';
            
            if (err.name === 'TokenExpiredError') {
                message = '❌ Token has expired';
                errorCode = 'TOKEN_EXPIRED';
            } else if (err.name === 'JsonWebTokenError') {
                message = '❌ Malformed token';
                errorCode = 'MALFORMED_TOKEN';
            }
            
            return res.status(401).json({
                message,
                error: errorCode,
                details: err.message
            });
        }
    }

    /**
     * Gérer la déconnexion de l'utilisateur
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static async Logout(req, res) {
        try {
            // Supprimer le cookie contenant le token
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // HTTPS en production uniquement
                sameSite: 'strict'
            });
            
            return res.status(200).json({
                message: '✅ Logout successful',
                timestamp: new Date().toISOString()
            });
        } catch (err) {
            next(new AppError('Error during logout', 500));
        }
    }

    /**
     * Vérifier si l'utilisateur est toujours connecté et rafraîchir le token si nécessaire
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static async RefreshToken(req, res) {
        try {
            // Le token a déjà été vérifié par le middleware verifyToken
            const { id, username, type } = req.user;
            
            // Récupérer les informations à jour de l'utilisateur depuis la base de données
            const account = await Account.findById(id);
            
            if (!account) {
                return res.status(404).json({
                    message: '❌ Account not found',
                });
            }
            
            // Générer un nouveau token
            const newToken = Authentication.generateToken({
                id: account.id,
                username: account.username,
                type: account.type
            });
            
            // Définir le nouveau cookie
            res.cookie('token', newToken, { 
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 1000 // 1 heure
            });
            
            return res.status(200).json({
                message: '✅ Token refreshed successfully',
                token: newToken,
                user: {
                    id: account.id,
                    username: account.username,
                    type: account.type
                }
            });
        } catch (err) {
            next(new AppError('Error refreshing token', 500));
        }
    }
}

export default Authentication;