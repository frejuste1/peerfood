import Customer from '../Models/Customer.js';
import Account from '../Models/Account.js';
import ResponseHandler from '../Utils/ResponseHandler.js';
import { customerSchema } from '../Utils/ValidationSchemas.js';
import ApiFeatures from '../Utils/ApiFeatures.js';

class Customers {

    static async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const status = req.query.status;
            const search = req.query.search;

            let customers;
            let total;

            if (status) {
                customers = await Customer.findAllWithAccounts(status);
                total = customers.length;
            } else {
                customers = await Customer.findAll();
                total = await Customer.count();
            }

            // Appliquer la recherche si fournie
            if (search) {
                customers = customers.filter(customer => 
                    customer.lastname?.toLowerCase().includes(search.toLowerCase()) ||
                    customer.firstname?.toLowerCase().includes(search.toLowerCase()) ||
                    customer.email?.toLowerCase().includes(search.toLowerCase()) ||
                    customer.username?.toLowerCase().includes(search.toLowerCase())
                );
                total = customers.length;
            }

            // Pagination manuelle
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedCustomers = customers.slice(startIndex, endIndex);

            if (paginatedCustomers.length === 0) {
                return ResponseHandler.notFound(res, 'Customers');
            }

            return ResponseHandler.paginated(res, paginatedCustomers, {
                page,
                limit,
                total
            });
        } catch (err) {
            return ResponseHandler.error(res, 'Error fetching customers', 500, err);
        }
    }

    static async getById(req, res) {
        const { id } = req.params;

        try {
            const customer = await Customer.findById(id);
            if (!customer) {
                return ResponseHandler.notFound(res, 'Customer');
            }
            return ResponseHandler.success(res, customer, 'Customer retrieved successfully');
        } catch (err) {
            return ResponseHandler.error(res, 'Error fetching customer', 500, err);
        }
    }

    static async getOne(req, res) {
        const { email } = req.params;

        try {
            const customer = await Customer.findOne(email);
            if (!customer) {
                return ResponseHandler.notFound(res, 'Customer');
            }
            return ResponseHandler.success(res, customer, 'Customer found successfully');
        } catch (err) {
            return ResponseHandler.error(res, 'Error searching customer', 500, err);
        }
    }

    static async create(req, res) {
        const { error, value } = customerSchema.validate(req.body);
        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));
            return ResponseHandler.validationError(res, errors);
        }

        try {
            // Vérifier si l'email existe déjà
            const existingCustomer = await Customer.findOne(value.email);
            if (existingCustomer) {
                return ResponseHandler.error(res, 'A customer with this email already exists', 409);
            }

            // Génération du code unique pour le client
            const customerCount = await Customer.count();
            const customerIdGenerated = `CLD${(customerCount + 1).toString().padStart(4, '0')}`;

            const customer = { 
                customerId: customerIdGenerated, 
                ...value 
            };
            const clientId = await Customer.create(customer);

            return ResponseHandler.success(res, { 
                customerId: customerIdGenerated,
                ...customer 
            }, 'Customer created successfully', 201);
        } catch (err) {
            return ResponseHandler.error(res, 'Error creating customer', 500, err);
        }
    }

    static async update(req, res) {
        const { id } = req.params;
        
        const { error, value } = customerSchema.validate(req.body, { allowUnknown: false });
        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));
            return ResponseHandler.validationError(res, errors);
        }

        try {
            const updatedRows = await Customer.update(id, value);
            if (updatedRows === 0) {
                return ResponseHandler.notFound(res, 'Customer');
            }
            
            const updatedCustomer = await Customer.findById(id);
            return ResponseHandler.success(res, updatedCustomer, 'Customer updated successfully');
        } catch (err) {
            return ResponseHandler.error(res, 'Error updating customer', 500, err);
        }
    }

    static async delete(req, res) {
        const { id } = req.params;

        try {
            // Vérifier si le client existe
            const existingCustomer = await Customer.findById(id);
            if (!existingCustomer) {
                return ResponseHandler.notFound(res, 'Customer');
            }

            const deletedRows = await Customer.delete(id);
            if (deletedRows === 0) {
                return ResponseHandler.notFound(res, 'Customer');
            }
            
            return ResponseHandler.success(res, null, 'Customer deleted successfully');
        } catch (err) {
            return ResponseHandler.error(res, 'Error deleting customer', 500, err);
        }
    }

    static async getTotal(req, res) {
        try {
            const total = await Customer.count();
            return ResponseHandler.success(res, { total }, 'Total customers count retrieved successfully');
        } catch (err) {
            return ResponseHandler.error(res, 'Error counting customers', 500, err);
        }
    }
}

export default Customers;