import axios from 'axios';

const API_URL = ' /api/wave/v1/checkout/sessions';
const API_KEY = 'wave_ci_prod_gG3Ba6CcWRBNr1CBKDh2YseMcms1XsikRXwf3Yw3z4Lgwj6HqfDjxDiQpw4nT8JnApR8HR59MWxqrvwDNIQd7Ymsfr-Atj8VuA'; // This key is for demonstration only and should not be used in production.

export default {
    /**
     * Creates a Wave checkout session and redirects the user to the Wave payment page.
     * @param {number} amount - The amount to be charged in XOF.
     * @returns {Promise<object>} A promise that resolves with the response data from the Wave API.
     * @throws {Error} Throws an error if the checkout session creation fails.
     */
    createCheckoutSession(amount) {
        // Validate the amount
        if (typeof amount !== 'number' || amount <= 0) {
            throw new Error('Invalid amount. Amount must be a positive number.');
        }

        const checkoutParams = {
            amount: amount.toString(), // Wave API expects amount as a string
            currency: 'XOF', // West African CFA franc
            error_url: `${window.location.origin}/payment/error`, // URL to redirect on payment failure
            success_url: `${window.location.origin}/payment/success` // URL to redirect on payment success
        };

        return axios.post(API_URL, checkoutParams, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            const waveUrl = response.data.wave_launch_url;
            if (waveUrl) {
                // Redirect the user to the Wave payment page
                window.location.href = waveUrl;
            } else {
                console.error('Wave launch URL not found in the response:', response.data);
                throw new Error('Failed to get Wave payment URL.');
            }
            return response.data;
        })
        .catch(error => {
            console.error('Error creating payment session:', error.response ? error.response.data : error.message);
            // Re-throw the error for further handling by the calling component
            throw error;
        });
    }
};