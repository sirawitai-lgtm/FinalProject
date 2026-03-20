const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/Inventory');

router.get('/logs',             controller.getAllLogs);
router.get('/summary',          controller.getDailySummary);
router.post('/adjust',          controller.adjustStock);
router.post('/summary/save',    controller.saveDailySummary);   
router.get('/summary/history',  controller.getSummaryHistory);  

module.exports = router;
