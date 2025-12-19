const axios = require('axios');

const ACQUIRE_HOST = process.env.ACQUIRE_HOST || 'http://acquire';
const ACQUIRE_PORT = process.env.ACQUIRE_PORT || '3001';
const PREDICT_HOST = process.env.PREDICT_HOST || 'http://predict';
const PREDICT_PORT = process.env.PREDICT_PORT || '3002';

const ACQUIRE_URL = process.env.ACQUIRE_URL || `${ACQUIRE_HOST}:${ACQUIRE_PORT}`;
const PREDICT_URL = process.env.PREDICT_URL || `${PREDICT_HOST}:${PREDICT_PORT}`;

function ensureConfig() {
    if (!ACQUIRE_URL || !PREDICT_URL) {
        throw { status: 500, message: "ACQUIRE_URL o PREDICT_URL no configurados" };
    }
}

async function runFullFlow() {
    try {
        ensureConfig();

        console.log(`[ORCHESTRATOR] Llamando a Acquire: ${ACQUIRE_URL}/data`);
        const acquireResponse = await axios.post(`${ACQUIRE_URL}/data`, {});

        const { dataId, features } = acquireResponse.data;

        console.log(`[ORCHESTRATOR] Llamando a Predict: ${PREDICT_URL}/predict`);
        const predictResponse = await axios.post(`${PREDICT_URL}/predict`, {
            features: features,
            meta: {
                dataId: dataId,
                source: "orchestrator"
            }
        });

        return { 
            dataId: dataId,
            predictionId: predictResponse.data.predictionId,
            prediction: predictResponse.data.prediction,
            timestamp: predictResponse.data.timestamp
        };

    } catch (error) {
        if (error.code == 'ECONNABORTED' || error.code == 'ETIMEDOUT') {
            throw { status: 504, message: "Gateway Timeout: Un servicio tardó demasiado"};
        }
        if (error.response) {
            throw { status: 502, message: `Bad Gateway: El servicio ${error.config?.url || 'desconocido'} devolvió error`};
        }
        throw { status: 500, message: "Internal Server Error en Orquestador" };
    }
}

module.exports = { runFullFlow };