import { apiMethods } from './api.js';

export default class Meal {
    static baseURL = '/meal';

    constructor(parameters = {}) {
        this.id = parameters.platId || parameters.id;
        this.designation = parameters.platName || parameters.designation || '';
        this.description = parameters.description || '';
        this.price = parseFloat(parameters.price) || 0;
        this.availability = parameters.availability || 1;
        this.imagePath = parameters.imagePath || '';
        this.category = parameters.category || null;
        this.isFavorite = parameters.isFavorite || false;
    }

    static async getAll() {
        try {
            const response = await apiMethods.get(this.baseURL);
            const meals = response.data || [];
            return meals.map(meal => new Meal(meal));
        } catch (error) {
            console.error('Erreur lors de la récupération des repas:', error);
            throw new Error(error.message || 'Impossible de récupérer la liste des repas');
        }
    }

    static async getById(id) {
        try {
            const response = await apiMethods.get(`${this.baseURL}/${id}`);
            return new Meal(response.data);
        } catch (error) {
            console.error(`Erreur lors de la récupération du repas ${id}:`, error);
            throw new Error(error.message || 'Repas non trouvé');
        }
    }

    static async getByCategory(categoryId) {
        try {
            const response = await apiMethods.get(this.baseURL, { category: categoryId });
            const meals = response.data || [];
            return meals.map(meal => new Meal(meal));
        } catch (error) {
            console.error('Erreur lors de la récupération des repas par catégorie:', error);
            throw new Error(error.message || 'Impossible de récupérer les repas de cette catégorie');
        }
    }

    static async search(query) {
        try {
            const response = await apiMethods.get(this.baseURL, { search: query });
            const meals = response.data || [];
            return meals.map(meal => new Meal(meal));
        } catch (error) {
            console.error('Erreur lors de la recherche de repas:', error);
            throw new Error(error.message || 'Erreur lors de la recherche');
        }
    }

    async save() {
        try {
            const mealData = {
                platName: this.designation,
                description: this.description,
                price: this.price,
                imagePath: this.imagePath,
                availability: this.availability
            };

            if (this.id) {
                const response = await apiMethods.put(`${Meal.baseURL}/${this.id}`, mealData);
                Object.assign(this, new Meal(response.data));
            } else {
                const response = await apiMethods.post(Meal.baseURL, mealData);
                Object.assign(this, new Meal(response.data));
            }
            return this;
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du repas:', error);
            throw new Error(error.message || 'Impossible de sauvegarder le repas');
        }
    }

    static async delete(id) {
        if (!id) throw new Error('ID du repas requis pour la suppression');
        
        try {
            await apiMethods.delete(`${this.baseURL}/${id}`);
            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression du repas:', error);
            throw new Error(error.message || 'Impossible de supprimer le repas');
        }
    }

    async deleteInstance() {
        if (!this.id) throw new Error('Impossible de supprimer un repas sans ID');
        
        try {
            await apiMethods.delete(`${Meal.baseURL}/${this.id}`);
            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression du repas:', error);
            throw new Error(error.message || 'Impossible de supprimer le repas');
        }
    }

    formatPrice() {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF'
        }).format(this.price);
    }

    formatPriceSimple() {
        return `${this.price.toLocaleString('fr-FR')} XOF`;
    }

    validate() {
        const errors = [];
        if (!this.designation) errors.push('La désignation est requise');
        if (this.designation.length < 2) errors.push('La désignation doit contenir au moins 2 caractères');
        if (!this.description) errors.push('La description est requise');
        if (this.description.length < 10) errors.push('La description doit contenir au moins 10 caractères');
        if (this.price < 0) errors.push('Le prix ne peut pas être négatif');
        if (!this.imagePath) errors.push('Une image est requise');
        return errors;
    }

    isAvailable() {
        return this.availability === 1 || this.availability === true;
    }

    getAvailabilityText() {
        return this.isAvailable() ? 'Disponible' : 'Non disponible';
    }

    toJSON() {
        return {
            id: this.id,
            designation: this.designation,
            description: this.description,
            price: this.price,
            availability: this.availability,
            imagePath: this.imagePath,
            category: this.category,
            isFavorite: this.isFavorite
        };
    }
}