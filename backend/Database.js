import mysql from 'mysql2';

class Database {
    constructor() {
        this.connection = null;
    }

    // Méthode pour établir la connexion à la base de données
    Start() {
        if (this.connection) {
            return '✅ Already connected to the database';  // Retourne si la connexion est déjà établie
        }

        return new Promise((resolve, reject) => {
            this.connection = mysql.createConnection({
                host: process.env.DB_HOST || 'localhost',
                user: process.env.DB_USER || 'root',
                password: process.env.DB_PASSWORD || 'root',
                database: process.env.DB_NAME || 'peerfood'
            });

            this.connection.connect((err) => {
                if (err) {
                    reject(`❌ Database connection failed: ${err.stack}`);
                } else {
                    resolve('✅ Connected to the database');
                }
            });
        });
    }

    // Méthode pour exécuter une requête SQL
    query(sql, params = []) {
        if (!this.connection) {
            throw new Error('❌ No database connection established.');
        }

        return new Promise((resolve, reject) => {
            this.connection.query(sql, params, (err, results) => {
                if (err) {
                    reject(`❌ Request Failed: ${err.message}`);
                } else {
                    resolve(results);
                }
            });
        });
    }

    // Méthode pour fermer la connexion à la base de données
    async close() {
        if (!this.connection) {
            throw new Error('❌ No active database connection to close.');
        }

        return new Promise((resolve, reject) => {
            this.connection.end((err) => {
                if (err) {
                    reject(`😖 Error closing connection: ${err.message}`);
                } else {
                    resolve('🌟 Closed connection');
                }
            });
        });
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

export default Database;