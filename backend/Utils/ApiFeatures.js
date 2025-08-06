class ApiFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        // Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 10;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }

    // Méthode pour la recherche textuelle
    search(searchFields = []) {
        if (this.queryString.search && searchFields.length > 0) {
            const searchTerm = this.queryString.search;
            const searchConditions = searchFields.map(field => ({
                [field]: { $regex: searchTerm, $options: 'i' }
            }));
            
            this.query = this.query.find({ $or: searchConditions });
        }
        return this;
    }

    // Méthode pour les filtres de date
    dateRange(dateField = 'createdAt') {
        if (this.queryString.startDate || this.queryString.endDate) {
            const dateFilter = {};
            
            if (this.queryString.startDate) {
                dateFilter.$gte = new Date(this.queryString.startDate);
            }
            
            if (this.queryString.endDate) {
                dateFilter.$lte = new Date(this.queryString.endDate);
            }
            
            this.query = this.query.find({ [dateField]: dateFilter });
        }
        return this;
    }
}

export default ApiFeatures;