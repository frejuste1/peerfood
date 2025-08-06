import Database from '../Config/database.js';

const db = Database.getInstance();

// Customer POO Object
class Customer {

    // Récupérer tous les clients
    static async findAll() {
        const query = "SELECT * FROM customers";
        try {
            console.log("🔍 Fetching all customers...");
            const customers = await db.query(query);
            if (customers.length === 0) {
                console.warn('⚠️ No customers found.');
                return [];
            }
            return customers;
        } catch (err) {
            console.error('😞 Error fetching all customers: ' + err.message);
            return [];
        }
    }

    // Récupérer un client par son ID
    static async findById(id) {
        if (!id) {
            console.warn('❌ Customer ID is required.');
            return null;
        }

        const query = "SELECT * FROM customers WHERE customerId = ?";
        try {
            console.log(`🔍 Fetching customer with ID: ${id}...`);
            const results = await db.query(query, [id]);
            if (results.length === 0) {
                console.warn(`⚠️ Customer with ID ${id} not found.`);
                return null;
            }
            return results[0];   // Retourne le premier client trouvé
        } catch (err) {
            console.error('😞 Error fetching customer by ID: ' + err.message);
            return null;
        }
    }

    // Rechercher un client par son email
    static async findOne(email) {
        if (!email) {
            console.warn('❌ Email is required.');
            return null;
        }

        const query = "SELECT * FROM customers WHERE email = ?";
        try {
            console.log(`🔍 Searching for customer with email: ${email}...`);
            const results = await db.query(query, [email]);
            if (results.length === 0) {
                console.warn(`⚠️ No customer found with email: ${email}.`);
                return null;
            }
            return results[0]; // Retourne le premier client trouvé
        } catch (err) {
            console.error('😞 Error searching customer by email: ' + err.message);
            return null;
        }
    }

    // Créer un nouveau client
    static async create(customer) {
        if (!customer?.firstname || !customer?.lastname || !customer?.customerId) {
            throw new Error('Le prénom, le nom et l\'ID du client sont requis');
        }

        const query = "INSERT INTO customers SET ?";
        try {
            console.log("➕ Creating a new customer...");
            const results = await db.query(query, customer);
            if (results.affectedRows === 0) {
                throw new Error('Échec de la création du client');
            }
            return customer.customerId;   // Retourne l'ID du client fourni
        } catch (err) {
            console.error('😞 Error creating customer: ' + err.message);
            throw err; // Propager l'erreur pour une meilleure gestion dans le contrôleur
        }
    }

    // Mettre à jour un client existant
    static async update(id, data) {
        if (!id || !data) {
            console.warn('❌ Customer ID and data are required.');
            return 0;
        }

        const query = "UPDATE customers SET ? WHERE customerId = ?";
        try {
            console.log(`✏️ Updating customer with ID: ${id}...`);
            const results = await db.query(query, [data, id]);
            if (results.affectedRows === 0) {
                console.warn(`⚠️ No customer found with ID ${id} to update.`);
            }
            return results.affectedRows;   // Retourne le nombre de lignes affectées
        } catch (err) {
            console.error('😞 Error updating customer: ' + err.message);
            return 0;
        }
    }

    // Supprimer un client
    static async delete(id) {
        if (!id) {
            console.warn('❌ Customer ID is required.');
            return 0;
        }

        const query = "DELETE FROM customers WHERE customerId = ?";
        try {
            console.log(`🕑 Deleting customer with ID: ${id}...`);
            const results = await db.query(query, [id]);
            if (results.affectedRows === 0) {
                console.warn(`⚠️ No customer found with ID ${id} to delete.`);
            }
            return results.affectedRows;   // Retourne le nombre de lignes affectées
        } catch (err) {
            console.error('😞 Error deleting customer: ' + err.message);
            return 0;
        }
    }

    // Compter le nombre total de clients
    static async count() {
        const query = "SELECT COUNT(*) as total FROM customers";
        try {
            console.log("🔢 Counting total customers...");
            const results = await db.query(query);
            return results[0].total;   // Retourne le nombre total de clients
        } catch (err) {
            console.error('😞 Error counting customers: ' + err.message);
            return 0;
        }
    }

    // Méthode hypothétique pour récupérer les clients avec leurs comptes (à implémenter selon votre schéma)
    static async findAllWithAccounts(status) {
        let query = `
            SELECT c.*, a.accountId, a.username, a.Role, a.statut
            FROM customers c
            INNER JOIN accounts a ON c.customerId = a.customer
        `;
        const params = [];

        if (status) {
            query += " WHERE a.statut = ?";
            params.push(status);
        }

        try {
            const results = await db.query(query, params);
            return results.map(row => ({
                id: row.accountId,
                lastname: row.lastname,
                firstname: row.firstname,
                phone: row.phone,
                username: row.username,
                type: row.role,
                status: row.statut,
                customerId: row.customerId // Ajout de customerId si nécessaire
            }));
        } catch (err) {
            console.error('😞 Error fetching customers with accounts:', err.message);
            return [];
        }
    }
}

export default Customer;