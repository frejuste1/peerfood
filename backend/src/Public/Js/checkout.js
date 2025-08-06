import 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js';
const apiKey = "wave_ci_prod_gG3Ba6CcWRBNr1CBKDh2YseMcms1XsikRXwf3Yw3z4Lgwj6HqfDjxDiQpw4nT8JnApR8HR59MWxqrvwDNIYQRYmsfr-Atj8VuA";

const response = axios.get('https://api.wave.com/v1/checkout/sessions', {
    headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
    },
});