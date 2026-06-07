require('dotenv').config();

const app = require('./src/app');
const client = require('./redis')

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});