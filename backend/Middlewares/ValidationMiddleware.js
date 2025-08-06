import Joi from 'joi';
import ResponseHandler from '../Utils/ResponseHandler.js';

class ValidationMiddleware {
    static validate(schema) {
        return (req, res, next) => {
            const { error, value } = schema.validate(req.body, {
                abortEarly: false,
                stripUnknown: true
            });

            if (error) {
                const errors = error.details.map(detail => ({
                    field: detail.path.join('.'),
                    message: detail.message,
                    value: detail.context?.value
                }));

                return ResponseHandler.validationError(res, errors);
            }

            req.body = value;
            next();
        };
    }

    static validateParams(schema) {
        return (req, res, next) => {
            const { error, value } = schema.validate(req.params, {
                abortEarly: false
            });

            if (error) {
                const errors = error.details.map(detail => ({
                    field: detail.path.join('.'),
                    message: detail.message,
                    value: detail.context?.value
                }));

                return ResponseHandler.validationError(res, errors);
            }

            req.params = value;
            next();
        };
    }

    static validateQuery(schema) {
        return (req, res, next) => {
            const { error, value } = schema.validate(req.query, {
                abortEarly: false,
                stripUnknown: true
            });

            if (error) {
                const errors = error.details.map(detail => ({
                    field: detail.path.join('.'),
                    message: detail.message,
                    value: detail.context?.value
                }));

                return ResponseHandler.validationError(res, errors);
            }

            req.query = value;
            next();
        };
    }
}

export default ValidationMiddleware;