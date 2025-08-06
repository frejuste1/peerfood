import Database from '../Database.js';

// Configuration de la base de données avec singleton pattern
class DatabaseConfig {
    constructor() {
        if (DatabaseConfig.instance) {
            return DatabaseConfig.instance;
        }
        
        this.db = Database.getInstance();
        DatabaseConfig.instance = this;
    }

    async initialize() {
        try {
            const message = await this.db.Start();
            console.log('✅ Database connection established:', message);
            return true;
        } catch (error) {
            console.error('❌ Database connection failed:', error);
            throw error;
        }
    }

    getConnection() {
        return this.db;
    }

    static getInstance() {
        if (!DatabaseConfig.instance) {
            DatabaseConfig.instance = new DatabaseConfig();
        }
        return DatabaseConfig.instance;
    }
}

export default DatabaseConfig;