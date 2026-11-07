import { Pool } from 'pg'
import crypto from 'crypto'
import { cache } from 'react'
import { hash } from 'bcrypt'

if (!global.pgPool) {
    global.pgPool = new Pool({
        connectionString: process.env.DATABASE_URL,
    })
}
const pool = global.pgPool



export const getUsersFromDB = cache(async () => {
    const { rows } = await pool.query('SELECT * FROM users')
    return rows
})

export const getUserFromDBByEmail = cache(async (email) => {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    return rows[0]
})

export const getUserFromDBById = cache(async (id) => {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id])
    return rows[0]
})

export const getUserFromDBByUsername = cache(async (username) => {
    const { rows } = await pool.query('SELECT * FROM users WHERE name = $1', [username])
    return rows[0]
})

export const getUserFromDBByToken = cache(async (token) => {
    const { rows } = await pool.query('SELECT * FROM users WHERE "verificationToken" = $1', [token])
    return rows[0]
})

export const getUserFromDBByResetToken = cache(async (token) => {
    const { rows } = await pool.query('SELECT * FROM users WHERE "resetToken" = $1', [token])
    return rows[0]
})



export async function forwardUserToDB(email, password, name) {
    const hashedPassword = await hash(password, 10)
    await pool.query(
        'INSERT INTO users (email, password, name, "emailVerified") VALUES ($1, $2, $3, null)',
        [email, hashedPassword, name]
    )
    return { success: true }
}

export async function updateUserAvatarByEmail(email, url) {
    await pool.query(
        'UPDATE users SET image = $1 WHERE email = $2',
        [url, email]
    )
}

export async function deleteUserByUsername(username) {
    await pool.query(
        'DELETE FROM users WHERE name = $1',
        [username]
    )
}

export const updateUserVerificationToken = async (email) => {
    const { rows } = await pool.query(
        'UPDATE users SET "emailVerified" = NOW() WHERE email = $1',
        [email]
    )
    return rows
}

export const updateUserPassword = async (password, email) => {
    const hashedPassword = await hash(password, 10)
    await pool.query(
        'UPDATE users SET password = $1, "resetToken" = NULL, "resetToken_createdAt" = NULL WHERE email = $2',
        [hashedPassword, email]
    )
    return { success: true }
}


export async function forwardResetTokenToDB(email) {
    const resetToken = crypto.randomBytes(32).toString('hex')

    const result = await pool.query(
        'UPDATE users SET "resetToken" = $1, "resetToken_createdAt" = NOW() WHERE email = $2',
        [resetToken, email]
    )

    if (result.rowCount === 0) {
        return { success: false, token: null }
    }

    return { success: true, token: resetToken }
}

export const deleteResetTokenById = async (id) => {
    await pool.query(
        'UPDATE users SET "resetToken" = NULL, "resetToken_createdAt" = NULL WHERE id = $1',
        [id]
    )
    return { success: true }
}

export async function deleteExpiredResetTokens() {
    await pool.query(
        `UPDATE users 
         SET "resetToken" = NULL, "resetToken_createdAt" = NULL 
         WHERE "resetToken" IS NOT NULL 
           AND "resetToken_createdAt" < NOW() - INTERVAL '1 hour'`
    )
    return { success: true }
}
