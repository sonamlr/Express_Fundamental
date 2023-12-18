require('dotenv').config();
const PORT = process.env.PORT || 5000;
const app = require('./app');
app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
})