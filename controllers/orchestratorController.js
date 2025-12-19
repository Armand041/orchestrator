const { runFullFlow } = require('../services/orchestratorService');

async function handleRun(req, res){
    try {
        const result = await runFullFlow();
        res.status(200).json(result);
    } catch (error) {
        console.error("[ORCHESTRATOR ERROR]:", error.message);
        res.status(error.status || 500).json({
            error: error.message
        });
    }
}

module.exports = { handleRun };