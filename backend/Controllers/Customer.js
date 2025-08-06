import Customer from '../Models/Customer.js';
import Account from '../Models/Account.js'; // Assurez-vous que ce modèle existe

// Fonction utilitaire pour gérer les erreurs serveur
const handleServerError = (res, message, error) => {
    console.error(message + ":", error);
    return res.status(500).json({ message: message, error: error.message });
};

// Contrôleur pour les clients
class Customers {

    // Récupérer tous les clients avec leurs comptes (optimisé)
    static async getAll(req, res) {
        try {
            
            const data = await Customer.findAll();

            if (!data.length) {
                return res.status(404).json({ message: '😓 No customers or accounts found matching the criteria.' });
            }

            res.status(200).json({
                message: '✅ Customers and accounts fetched successfully',
                data: data
            });
        } catch (err) {
            handleServerError(res, '😖 Error fetching customers and accounts', err);
        }
    }

    // Récupérer un client par ID
    static async getById(req, res) {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: '❌ Customer ID is required.' });
        }

        try {
            const customer = await Customer.findById(id);
            if (!customer) {
                return res.status(404).json({
                    message: `😓 Client with ID ${id} not found`
                });
            }
            res.status(200).json({
                message: '✅ Client fetched successfully',
                data: customer
            });
        } catch (err) {
            handleServerError(res, '😖 Error fetching client by ID', err);
        }
    }

    // Rechercher un client par email
    static async getOne(req, res) {
        const { email } = req.params;
        if (!email) {
            return res.status(400).json({ message: '❌ Email is required.' });
        }

        try {
            const customer = await Customer.findOne(email);
            if (!customer) {
                return res.status(404).json({
                    message: `😓 No client found with the email ${email}`
                });
            }
            res.status(200).json({
                message: '✅ Client found successfully',
                data: customer
            });
        } catch (err) {
            handleServerError(res, '😖 Error searching client', err);
        }
    }

    // Créer un nouveau client
    static async create(req, res) {
        const { lastname, firstname, phone, email } = req.body;

        // 🔎 Validation des champs requis
        if (!lastname || !firstname || !phone || !email) {
            return res.status(400).json({ message: '⚠️ Tous les champs sont obligatoires' });
        }

        // 📌 Validation du format email et téléphone
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10,15}$/; // Accepte entre 10 et 15 chiffres

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: '⚠️ Email invalide' });
        }
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ message: '⚠️ Numéro de téléphone invalide' });
        }

        try {
            // 🛑 Vérifier si l'email existe déjà
            const existingCustomer = await Customer.findOne(email);
            if (existingCustomer) {
                return res.status(409).json({ message: '⚠️ Un client avec cet email existe déjà' });
            }

            // 📊 Génération du code unique pour le client
            const customerCount = await Customer.count();
            const customerIdGenerated = `CLD${(customerCount + 1).toString().padStart(4, '0')}`;

            // 🗓️ Date d'inscription (optionnel, peut-être géré par la base de données)
            const dateInsc = new Date(); // eslint-disable-line no-unused-vars

            // 📌 Création des données du client
            const customer = { customerId: customerIdGenerated, lastname, firstname, phone, email };
            const clientId = await Customer.create(customer);

            return res.status(201).json({
                message: '✅ Client créé avec succès',
                clientId: customerIdGenerated
            });
        } catch (err) {
            handleServerError(res, '😖 Erreur lors de la création du client', err);
        }
    }

    // Mettre à jour un client
    static async update(req, res) {
        const { id } = req.params;
        const data = req.body;

        if (!id || !data) {
            return res.status(400).json({ message: '❌ Customer ID and data are required.' });
        }

        try {
            const updatedRows = await Customer.update(id, data);
            if (updatedRows === 0) {
                return res.status(404).json({
                    message: `😓 Client with ID ${id} not found or no change`
                });
            }
            res.status(200).json({
                message: '✅ Client updated successfully',
                updatedRows: updatedRows
            });
        } catch (err) {
            handleServerError(res, '😖 Error updating client', err);
        }
    }

    // Supprimer un client
    static async delete(req, res) {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: '❌ Customer ID is required.' });
        }

        try {
            const deletedRows = await Customer.delete(id);
            if (deletedRows === 0) {
                return res.status(404).json({
                    message: `😓 Client with ID ${id} not found`
                });
            }
            res.status(200).json({
                message: '✅ Client deleted successfully',
                deletedRows: deletedRows
            });
        } catch (err) {
            handleServerError(res, '😖 Error deleting client', err);
        }
    }

    // Compter le nombre total de clients
    static async getTotal(req, res) {
        try {
            const total = await Customer.count();
            res.status(200).json({
                message: '✅ Total number of clients fetched successfully',
                total: total
            });
        } catch (err) {
            handleServerError(res, '😖 Error counting clients', err);
        }
    }
}

export default Customers;