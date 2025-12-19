require('dotenv').config();
const express = require('express');
const orchestratorRoutes = require('./routes/orchestratorRoutes');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({
        status: "ok",
        service: "orchestrator"
    });
});

app.use('/', orchestratorRoutes);

app.listen(PORT, () => {
    console.log(`Orquestador listo en http://localhost:${PORT}`);
});