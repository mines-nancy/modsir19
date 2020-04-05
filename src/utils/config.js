const prod = process.env.NODE_ENV === 'production'; // Anything else is treated as 'dev'

export const API_URL = prod ? 'https://SERVER-URL' : 'http://localhost:5000';

if (!API_URL) {
    console.log('No API connection string. Set API_URL environment variable.');
}

export const VERSION = '0.1';
