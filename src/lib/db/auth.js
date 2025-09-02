import { query } from './mysql';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

// Login user with email and password
export async function login(email, password) {
    try {
        // Get user from database
        const users = await query('SELECT * FROM users WHERE email = ?', [email]);
        
        // Check if user exists
        if (users.length === 0) {
            return { success: false, message: 'Invalid email or password' };
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, users[0].password_hash);
        if (!isValidPassword) {
            return { success: false, message: 'Invalid email or password' };
        }

        // Generate session token
        const token = uuidv4();
        const expires = new Date();
        expires.setDate(expires.getDate() + 7); // 7 days expiration

        // Update user session
        await query(
            'UPDATE users SET session_token = ?, session_expiration = ? WHERE id = ?',
            [token, expires, users[0].id]
        );

        return { success: true, token, user: users[0] };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Server error during login' };
    }
}

// Register new user
export async function register(email, username, password) {
    try {
        // Check if email is already in use
        const usersWithEmail = await query('SELECT * FROM users WHERE email = ?', [email]);
        if (usersWithEmail.length > 0) {
            return { success: false, message: 'Email already in use' };
        }

        // Check if username is already in use
        const usersWithUsername = await query('SELECT * FROM users WHERE username = ?', [username]);
        if (usersWithUsername.length > 0) {
            return { success: false, message: 'Username already in use' };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const result = await query(
            'INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)',
            [email, username, hashedPassword]
        );

        // Generate session token
        const token = uuidv4();
        const expires = new Date();
        expires.setDate(expires.getDate() + 7); // 7 days expiration

        // Set user session
        await query(
            'UPDATE users SET session_token = ?, session_expiration = ? WHERE id = ?',
            [token, expires, result.insertId]
        );

        return { success: true, token, message: 'User created successfully' };
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, message: 'Server error during registration' };
    }
}

// Validate session token
export async function validateSession(token) {
    try {
        const users = await query(
            'SELECT * FROM users WHERE session_token = ? AND session_expiration > NOW()',
            [token]
        );
        
        return users.length > 0 ? users[0] : null;
    } catch (error) {
        console.error('Session validation error:', error);
        return null;
    }
}