const { getConnection } = require('../config/db')

// หา user ด้วย username
const findByUsername = async (username) => {
    const conn = await getConnection()
    const [rows] = await conn.query(
        'SELECT * FROM Users WHERE Username = ?', [username]
    )
    return rows[0]
}

// สร้าง user ใหม่ (password ต้อง hash มาแล้ว)
const create = async ({ username, passwordHash, role, displayName }) => {
    const conn = await getConnection()
    const [result] = await conn.query(
        'INSERT INTO Users (Username, Password, Role, Display_name) VALUES (?, ?, ?, ?)',
        [username, passwordHash, role, displayName]
    )
    return result
}

// ดึง users ทั้งหมด (ไม่คืน password)
const findAll = async () => {
    const conn = await getConnection()
    const [rows] = await conn.query(
        'SELECT User_id, Username, Role, Display_name, Created_at FROM Users'
    )
    return rows
}

module.exports = { findByUsername, create, findAll }
