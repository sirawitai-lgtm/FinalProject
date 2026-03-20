const InventoryModel = require('../models/Inventory');

// ─── GET ALL LOGS ──────────────────────────────────
const getAllLogs = async (req, res, next) => {
    try {
        const logs = await InventoryModel.findAll();
        res.json(logs);
    } catch (error) { next(error); }
};

// ─── GET DAILY SUMMARY (JSON ย่อ) ─────────────────
const getDailySummary = async (req, res, next) => {
    try {
        const summary = await InventoryModel.getDailySummary();
        const result = {
            date: new Date().toLocaleDateString('th-TH'),
            in:   summary.find(s => s.Action_type === 'IN')?.Total_Amount  || 0,
            out:  summary.find(s => s.Action_type === 'OUT')?.Total_Amount || 0,
            raw:  summary
        };
        res.json(result);
    } catch (error) { next(error); }
};

// ─── ADJUST STOCK ──────────────────────────────────
const adjustStock = async (req, res, next) => {
    const { productId, type, amount } = req.body;
    try {
        await InventoryModel.adjustStock(productId, type, amount);
        res.json({ message: `Stock ${type} success!` });
    } catch (error) { next(error); }
};

// ─── SAVE SNAPSHOT (เรียกตอนกดปุ่ม) ──────────────
const saveDailySummary = async (req, res, next) => {
    try {
        const [summaryRows, products] = await Promise.all([
            InventoryModel.getDailySummary(),
            InventoryModel.getDailySummaryDetail()
        ]);

        const totalIn  = summaryRows.find(s => s.Action_type === 'IN')?.Total_Amount  || 0;
        const totalOut = summaryRows.find(s => s.Action_type === 'OUT')?.Total_Amount || 0;
        const net      = totalIn - totalOut;

        const detail = products.map(p => ({
            product_id: p.Products_id,
            name:       p.Product_name,
            qty:        p.Current_Stock,
            min:        p.Min_stock,
            in:         p.Total_IN,
            out:        p.Total_OUT,
            net:        p.Total_IN - p.Total_OUT,
            is_low:     p.Current_Stock < p.Min_stock
        }));

        const lowCount = detail.filter(p => p.is_low).length;

        // ใช้ timezone ไทย UTC+7
        const now = new Date();
        const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
        const thaiNow = new Date(utcMs + 7 * 60 * 60000);
        const today = `${thaiNow.getFullYear()}-${String(thaiNow.getMonth()+1).padStart(2,'0')}-${String(thaiNow.getDate()).padStart(2,'0')}`;

        await InventoryModel.saveSummary({
            summary_date: today,
            total_in:     totalIn,
            total_out:    totalOut,
            net_change:   net,
            detail_json:  detail,
            low_count:    lowCount
        });

        res.json({ message: 'Summary saved successfully.' });
    } catch (error) { next(error); }
};

// ─── GET HISTORY (PHP page เรียก) ─────────────────
const getSummaryHistory = async (req, res, next) => {
    try {
        const rows = await InventoryModel.getSummaryHistory();
        res.json(rows);
    } catch (error) { next(error); }
};

module.exports = { getAllLogs, getDailySummary, adjustStock, saveDailySummary, getSummaryHistory };
