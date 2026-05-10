const db = require('../config/db');

const findByEmail = async (email) => {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
};

const updatePassword = async (email, hashedPassword) => {
    const [result] = await db.execute('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);
    return result;
};

module.exports = { findByEmail, updatePassword };