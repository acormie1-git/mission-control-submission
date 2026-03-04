const app = require('./app');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`NASA Media Service listening on port ${PORT}`);
});