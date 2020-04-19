const prod = process.env.NODE_ENV === 'production'; // Anything else is treated as 'dev'

export const API_URL = prod ? process.env.REACT_APP_API_URL : 'http://localhost:5000';

if (!API_URL) {
    throw new Error('No API connection string. Set REACT_APP_API_URL environment variable.');
}

export const VERSION = '0.1';
