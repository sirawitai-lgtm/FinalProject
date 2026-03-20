const { getConnection } = require('../config/db');

//============ โชวหน้าตาราง log ==========================
const findAll = async () => {
    const conn = await getConnection();
    const [rows] = await conn.query(`
        SELECT l.Id, l.Product_id, l.Action_type, l.Amount,
               DATE_FORMAT(CONVERT_TZ(l.Created_at, '+00:00', '+07:00'), '%d/%m/%Y %H:%i:%s') AS Created_at,
               p.Product_name 
        FROM Inventory_logs l 
        JOIN Products p ON l.Product_id = p.Products_id 
        ORDER BY l.Created_at DESC
    `)
    return rows;
}
//================= GET Daily_summaries =======================
const getDailySummary = async () => {
    const conn = await getConnection();
    const [rows] = await conn.query(`
        SELECT 
            Action_type, 
            SUM(Amount) as Total_Amount,
            COUNT(*) as Transaction_Count
        FROM Inventory_logs 
        WHERE DATE(Created_at) = CURDATE() 
        GROUP BY Action_type
    `)
    return rows;
}


const adjustStock = async (productId, type, amount) => {
    const conn = await getConnection();
    try {
        await conn.beginTransaction();
        const qtyChange = (type === 'IN') ? amount : -amount;
        await conn.query(
            'UPDATE Products SET Quantity = Quantity + ? WHERE Products_id = ?',
            [qtyChange, productId]
        );
        await conn.query(
            'INSERT INTO Inventory_logs (Product_id, Action_type, Amount) VALUES (?, ?, ?)',
            [productId, type, amount]
        );
        await conn.commit();

        return true;
    } catch (error) {
        await conn.rollback();
        throw error;
    }
};



const getDailySummaryDetail = async () => {
    const conn = await getConnection();
    const [rows] = await conn.query(`
        SELECT 
            p.Products_id,
            p.Product_name,
            p.Quantity        AS Current_Stock,
            p.Min_stock,
            COALESCE(SUM(CASE WHEN l.Action_type='IN'  THEN l.Amount ELSE 0 END),0) AS Total_IN,
            COALESCE(SUM(CASE WHEN l.Action_type='OUT' THEN l.Amount ELSE 0 END),0) AS Total_OUT
        FROM Products p
        LEFT JOIN Inventory_logs l
            ON p.Products_id = l.Product_id
            AND DATE(l.Created_at) = CURDATE()
        GROUP BY p.Products_id, p.Product_name, p.Quantity, p.Min_stock
        ORDER BY p.Product_name
    `);
    return rows;
};


const saveSummary = async (summaryData) => {
    const conn = await getConnection();
    const { summary_date, total_in, total_out, net_change, detail_json, low_count } = summaryData;
    const [result] = await conn.query(
        `INSERT INTO Daily_summaries 
         (summary_date, total_in, total_out, net_change, detail_json, low_count)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [summary_date, total_in, total_out, net_change, JSON.stringify(detail_json), low_count]
    );
    return result;
};


const getSummaryHistory = async () => {
    const conn = await getConnection();
    const [rows] = await conn.query(
        `SELECT * FROM Daily_summaries ORDER BY snapshot_at DESC`
    );
    return rows;
};

module.exports = { findAll, getDailySummary, getDailySummaryDetail, saveSummary, getSummaryHistory, adjustStock };
