const db = require('../config/db');

const saveOTP = async (email, otp) => {
    await db.execute('DELETE FROM otps WHERE email = ?', [email]);
    const [result] = await db.execute('INSERT INTO otps (email, otp) VALUES (?, ?)', [email, otp]);
    return result;
};

const verifyOTP = async (email, otp) => {
    const [rows] = await db.query(
        'SELECT * FROM otps WHERE email = ? AND otp = ? AND created_at >= NOW() - INTERVAL 5 MINUTE',
        [email, otp]
    );
    return rows[0];
};

const deleteOTP = async (email) => {
    await db.execute('DELETE FROM otps WHERE email = ?', [email]);
};

module.exports = { saveOTP, verifyOTP, deleteOTP };