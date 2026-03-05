import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const content = require('./site-content.json');

export default {
    ...content,
    "therapist": process.env.THERAPIST,
    "email": process.env.EMAIL,
    "address": process.env.ADDRESS,
    "web3forms_key": process.env.WEB3FORMS_KEY,
    "url": process.env.URL,
    "calcom": process.env.CALCOM,
};

