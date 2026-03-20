const bcrypt     = require('bcrypt')
const UsersModel = require('../models/Users')

// POST /auth/login
const login = async (req, res, next) => {
    const { username, password } = req.body
    try {
        if (!username || !password)
            return res.status(400).json({ message: 'กรุณากรอก username และ password' })

        const user = await UsersModel.findByUsername(username)
        if (!user)
            return res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' })

        const match = await bcrypt.compare(password, user.Password)
        if (!match)
            return res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' })

        res.json({
            message: 'login success',
            user: {
                id:          user.User_id,
                username:    user.Username,
                role:        user.Role,
                displayName: user.Display_name
            }
        })
    } catch (err) { next(err) }
}


const register = async (req, res, next) => {
    const { username, password } = req.body
    try {
        if (!username || !password)
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' })

        // รหัสผ่านขั้นต่ำ 4 ตัว
        if (password.length < 4)
            return res.status(400).json({ message: 'รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร' })

        const existing = await UsersModel.findByUsername(username)
        if (existing)
            return res.status(409).json({ message: `Username "${username}" มีอยู่แล้ว` })

        const passwordHash = await bcrypt.hash(password, 10)
        await UsersModel.create({
            username,
            passwordHash,
            role: 'user',           
            displayName: username    // ใช้ username เป็นชื่อที่แสดง
        })

        res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ' })
    } catch (err) { next(err) }
}

// GET /auth/users
const getUsers = async (req, res, next) => {
    try {
        const users = await UsersModel.findAll()
        res.json(users)
    } catch (err) { next(err) }
}

module.exports = { login, register, getUsers }
