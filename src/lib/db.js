import mysql from 'mysql2/promise'
import crypto from 'crypto'
import { cache } from 'react'
import { hash } from 'bcrypt'

const dbConfig = {
    port: process.env.DB_PORT || 4000,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
    }
}

if (!global.mysqlPool || global.mysqlPool._closed) {
    global.mysqlPool = mysql.createPool(dbConfig)
}

const pool = global.mysqlPool



export const getUsersFromDB = cache(async () => {
    const [rows] = await pool.execute('SELECT * FROM users')
    return rows
})

export const getUserFromDBByEmail = cache(async (email) => {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email])
    return rows[0]
})

export const getUserFromDBById = cache(async (id) => {
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id])
    return rows[0]
})

export const getUserFromDBByUsername = cache(async (username) => {
    const [rows] = await pool.execute('SELECT * FROM users WHERE name = ?', [username])
    return rows[0]
})


export async function forwardUserToDB(email, password, name) {
    const hashedPassword = await hash(password, 10)
    await pool.execute(
        'INSERT INTO users (email, password, name, emailVerified) VALUES (?, ?, ?, null)',
        [email, hashedPassword, name]
    )
    return { success: true }
}


export async function updateUserAvatarByEmail(email, url) {
    await pool.execute(
        'UPDATE users SET image = ? WHERE email = ?',
        [url, email]
    )
}


export async function deleteUserByUsername(username) {
    await pool.execute(
        'delete from users where name = ?',
        [username]
    )
}

export const getUserFromDBByToken = cache(async (token) => {
    const [rows] = await pool.execute('SELECT * FROM users WHERE verificationToken  = ?', [token])
    return rows[0]
})

export const updateUserVerificationToken = async (email) => {

    const [rows] = await pool.execute(
        'UPDATE users SET emailVerified = NOW() WHERE email = ?',
        [email]
    )
    return rows
}

export const updateUserPassword = async (password, email) => {
    const hashedPassword = await hash(password, 10)
    await pool.execute('UPDATE users SET password = ?, resetToken = NULL, resetToken_createdAt = NULL WHERE email = ?', [hashedPassword, email])
    return { success: true }
}

/* 



export async function forwardResetTokenToDB(email) {
    const resetToken = crypto.randomBytes(32).toString('hex')
    const result = await pool.execute(
        'UPDATE users SET resetToken = ?, resetToken_createdAt = NOW() WHERE email = ?',
        [resetToken, email]
    )

    if (result.affectedRows === 0) {
        return { success: false, token: null }
    }

    return { success: true, token: resetToken }
}


export const getUserFromDBByResetToken = cache(async (token) => {
    const [rows] = await pool.execute('SELECT * FROM users WHERE resetToken = ?', [token])
    return rows[0]
})

export const deleteResetTokenById = async (id) => {
    await pool.execute('UPDATE users SET resetToken = NULL, resetToken_createdAt = NULL WHERE id = ?', [id])
    return { success: true }
}


export async function deleteExpiredResetTokens() {
    await pool.execute(
        `UPDATE users 
         SET resetToken = NULL, resetToken_createdAt = NULL 
         WHERE resetToken IS NOT NULL 
           AND resetToken_createdAt < DATE_SUB(NOW(), INTERVAL 1 HOUR)`
    )
    return { success: true }
}






 */