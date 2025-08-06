import axios from 'axios';
import Joi from 'joi';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.WAVE_API_KEY;
const apiUrl = process.env.WAVE_API_URL;

class CheckOut {

    static async getAll(req, res) {
        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            }); 
            res.json({
                message: '✅ Checkouts fetched successfully',
                data: response.data
            });
        }  catch (error) {
            res.status(500).json({
                message: '😖 Error fetching checkouts',
                error: error.message
            }); 
        }
    }

    static async getById(req, res) {
        const { id } = req.params;
        try {
            const response = await axios.get(`${apiUrl}/${id}`, {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            });  
            res.json({
                message: '✅ Checkout fetched successfully',
                data: response.data 
            });
        } catch (error) {
            res.status(500).json({
                message: '😖 Error fetching checkout',
                error: error.message
            }); 
        }
    }
    
    static async create(req, res) {
        const schema = Joi.object({
           amount: Joi.number().required(),
           currency: Joi.string().required(), 
        });
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: '😓 Validation error',
                details: error.details
            });
        }
        try {
            const response = await axios.post(apiUrl, value, {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            }); 
            res.status(201).json({
                message: '✅ Checkout created successfully',
                paymentId: response.data
            })
        } catch (error) {
            res.status(500).json({
                message: '😖 Error creating checkout',
                error: error.message
            }); 
        }
    } 
}

export default CheckOut;