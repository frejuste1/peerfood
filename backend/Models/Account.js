import Database from "../Config/database.js";
import Joi from 'joi';
import AppError from '../Utils/AppError.js';

const db = Database.getInstance();

class Account {

    static async findAll(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const query = `SELECT * FROM accounts ORDER BY accountId ASC LIMIT ${limit} OFFSET ${offset}`;
        try {
            const results = await db.query(query);
            if (results.length === 0) {
                console.warn('⚠️  No accounts found.');
                return [];
            }
            return results;
        } catch (err) {
            console.error('😞 Error fetching all accounts: ' + err.message);
            throw new AppError('Error fetching all accounts', 500);
        }
    }

    static async findById (id) {
        if (!id) {
            console.warn('❌ Account ID is required.');
            throw new AppError('Account ID is required', 400);
        }

        const query = "SELECT * FROM accounts WHERE accountId = ?";
        try {
            const results = await db.query(query, [id]);
            if (results.length === 0) {
                console.warn(`⚠️ Account with ID ${id} not found.`);
                return null;
            }
            return results[0];  // Retourne le premier compte trouvé
        } catch (err) {
            console.error('😞 Error fetching account by ID: ' + err.message);
            throw new AppError('Error fetching account by ID', 500);
        }
    }

    static async findOne(username) {
        if (!username) {
            console.warn('❌ Username is required.');
            throw new AppError('Username is required', 400);
        }
    
        const query = "SELECT * FROM accounts WHERE username = ?"; 
        try {
            const results = await db.query(query, [username]);
    
            if (!results || results.length === 0) {
                console.warn('⚠️ No account found.');
                return null;
            }
    
            return results[0]; // Return single user object
        } catch (err) {
            console.error('😞 Error searching account:', err.message);
            throw new AppError('Error searching account', 500);
        }
    }
    

    static async filter(statut) {
        if (!statut) {
            console.warn('❌ Statut is required.');
            return [];
        }
    
        const statusMapping = { "active": "Enabled", "inactive": "Disabled" };
        const mappedStatus = statusMapping[statut] || statut; // Convertir si nécessaire
    
        const query = "SELECT * FROM accounts WHERE statut = ?";
        try {
            const results = await db.query(query, [mappedStatus]);
            if (results.length === 0) {
                console.warn('⚠️ No accounts found with the specified status.');
                return [];
            }
            return results;
        } catch (err) {
            console.error('😞 Error filtering accounts by status: ' + err.message);
            throw new AppError('Error filtering accounts by status', 500);
        }
    }
    

    static async Create(account) {
        const schema = Joi.object({
            customer: Joi.number().required(),
            username: Joi.string().min(3).max(50).required(),
            mdpasse: Joi.string().min(8).required(),
            role: Joi.string().valid('Student', 'Teacher').default('Student'),
            statut: Joi.string().valid('Enabled', 'Disabled').default('Enabled')
        });

        const { error, value } = schema.validate(account);

        if (error) {
            throw new AppError(`Validation error: ${error.details.map(x => x.message).join(', ')}`, 400);
        }

        const query = "INSERT INTO accounts SET ?";
        try {
            const queryResponse = await db.query(query, [account]); // Using parameterized queries

            // Log pour débogage (peut être activé si nécessaire)
            // console.log('Database query response:', JSON.stringify(queryResponse, null, 2));

            // S'assurer que queryResponse est un objet et a 'insertId'
            if (typeof queryResponse !== 'object' || queryResponse === null || !('insertId' in queryResponse)) {
                console.error('😞 Database response does not contain insertId or is not an object:', queryResponse);
                throw new AppError('Database did not return insertId after account creation or response is not an object.', 500);
            }

            return queryResponse.insertId; // Return the inserted account ID
        } catch (err) {
            // Logguer le message d'erreur pour un meilleur débogage côté serveur
            console.error(`😞 Error creating account: ${err.message}`, err.stack);
            // Relancer une erreur encapsulée pour plus de contexte.
            throw new AppError(`Failed to create account in database. ${err.message}`, 500);
        }
    }
    

    static async Update(id, data) {
        if (!id || !data) {
            console.warn('❌ Account ID and data are required.');
            throw new AppError('Account ID and data are required', 400);
        }

        const schema = Joi.object({
            customer: Joi.number(),
            username: Joi.string().min(3).max(50),
            mdpasse: Joi.string().min(8),
            role: Joi.string().valid('Student', 'Teacher'),
            statut: Joi.string().valid('Enabled', 'Disabled')
        });

        const { error, value } = schema.validate(data);

        if (error) {
            throw new AppError(`Validation error: ${error.details.map(x => x.message).join(', ')}`, 400);
        }

        const query = "UPDATE accounts SET ? WHERE accountId = ?";
        try {
            const results = await db.query(query, [data, id]);
            if (results.affectedRows === 0) {
                console.warn(`⚠️ No account found with ID ${id} to update.`);
            }
            return results.affectedRows;  // Retourne le nombre de lignes affectées
        } catch (err) {
            console.error('😞 Error updating account: ' + err.message);
            throw new AppError('Error updating account', 500);
        }
    }

    static async Delete(id) {
        if (!id) {
            console.warn('❌ Account ID is required.');
            throw new AppError('Account ID is required', 400);
        }

        const query = "DELETE FROM accounts WHERE accountId = ?";
        try {
            const results = await db.query(query, [id]);
            if (results.affectedRows === 0) {
                console.warn(`⚠️ No account found with ID ${id} to delete.`);
            }
            return results.affectedRows;  // Retourne le nombre de lignes affectées
        } catch (err) {
            console.error('😞 Error deleting account: ' + err.message);
            throw new AppError('Error deleting account', 500);
        }
    }

    static async Count() {
        const query = "SELECT COUNT(*) as total FROM accounts";
        try {
            const results = await db.query(query);
            return results[0].total;  // Retourne le nombre total de compte
        } catch (err) {
            console.error('😞 Error counting accounts: ' + err.message);
            throw new AppError('Error counting accounts', 500);
        }
    }

    static async Enable(id) {
        if (!id) {
            console.warn('❌ Account ID is required.');
            return false; // Return early if id is missing
        }
        const query = "UPDATE accounts SET statut = 'Enabled' WHERE accountId = ?";
        try {
            const result = await db.query(query, [id]); // Pass the id parameter
            return true;
        } catch (error) {
            console.error('😞 Error enabling account: ' + error.message);
            throw new AppError('Error enabling account', 500);
        }
    }
    
    static async Disable(id) {
        if (!id) {
            console.warn('❌ Account ID is required.');
            return false; // Return early if id is missing
        }
        const query = "UPDATE accounts SET statut = 'Disabled' WHERE accountId = ?";
        try {
            const result = await db.query(query, [id]); // Pass the id parameter
            return true;
        } catch (error) {
            console.error('😞 Error disabling account: ' + error.message);
            throw new AppError('Error disabling account', 500);
        }
    }

}

export default Account;