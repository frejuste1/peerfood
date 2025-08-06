import axios from 'axios';

export default class Meal {
    static baseURL = 'http://localhost:8086/meal';

    constructor(parameters = {}) {
        this.id = parameters.idPlat;
        this.designation = parameters.designation || '';
        this.description = parameters.description || '';
        this.price = parseFloat(parameters.price) || 0;
        this.availability = parameters.availability || 1;
        this.imagePath = parameters.imagePath || '';
    }

    static async getAll() {
        try {
            const response = await axios.get(this.baseURL);
            const meals = response.data.data || [];
            return meals.map(meal => new Meal(meal));
        } catch (error) {
            console.error('Erreur lors de la récupération des repas:', error);
            throw new Error('Impossible de récupérer la liste des repas');
        }
    }

    static async getById(id) {
        try {
            const response = await axios.get(`${this.baseURL}/${id}`);
            return new Meal(response.data);
        } catch (error) {
            console.error(`Erreur lors de la récupération du repas ${id}:`, error);
            throw new Error('Repas non trouvé');
        }
    }

    async save() {
        try {
            if (this.id) {
                const response = await axios.put(`${Meal.baseURL}/${this.id}`, this);
                Object.assign(this, response.data);
            } else {
                const response = await axios.post(Meal.baseURL, this);
                Object.assign(this, response.data);
            }
            return this;
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du repas:', error);
            throw new Error('Impossible de sauvegarder le repas');
        }
    }

    async delete() {
        if (!this.id) throw new Error('Impossible de supprimer un repas sans ID');
        try {
            await axios.delete(`${Meal.baseURL}/${this.id}`);
            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression du repas:', error);
            throw new Error('Impossible de supprimer le repas');
        }
    }

    formatPrice() {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(this.price);
    }

    validate() {
        const errors = [];
        if (!this.designation) errors.push('La désignation est requise');
        if (this.price < 0) errors.push('Le prix ne peut pas être négatif');
        return errors;
    }

    toJSON() {
        return {
            id: this.id,
            designation: this.designation,
            description: this.description,
            price: this.price,
            availability: this.availability,
            image: this.imagePath
        };
    }
}