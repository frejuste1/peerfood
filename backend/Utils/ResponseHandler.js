class ResponseHandler {
    static success(res, data, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
            timestamp: new Date().toISOString()
        });
    }

    static error(res, message = 'Internal Server Error', statusCode = 500, error = null) {
        const response = {
            success: false,
            message,
            timestamp: new Date().toISOString()
        };

        if (process.env.NODE_ENV === 'development' && error) {
            response.error = error.message;
            response.stack = error.stack;
        }

        return res.status(statusCode).json(response);
    }

    static validationError(res, errors) {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors,
            timestamp: new Date().toISOString()
        });
    }

    static notFound(res, resource = 'Resource') {
        return res.status(404).json({
            success: false,
            message: `${resource} not found`,
            timestamp: new Date().toISOString()
        });
    }

    static unauthorized(res, message = 'Unauthorized access') {
        return res.status(401).json({
            success: false,
            message,
            timestamp: new Date().toISOString()
        });
    }

    static forbidden(res, message = 'Access forbidden') {
        return res.status(403).json({
            success: false,
            message,
            timestamp: new Date().toISOString()
        });
    }

    static paginated(res, data, pagination, message = 'Data retrieved successfully') {
        return res.status(200).json({
            success: true,
            message,
            data,
            pagination: {
                currentPage: pagination.page,
                totalPages: Math.ceil(pagination.total / pagination.limit),
                totalItems: pagination.total,
                itemsPerPage: pagination.limit,
                hasNextPage: pagination.page < Math.ceil(pagination.total / pagination.limit),
                hasPrevPage: pagination.page > 1
            },
            timestamp: new Date().toISOString()
        });
    }
}

export default ResponseHandler;