import { query } from './mysql';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const SESSION_DAYS = 7;

// ---------- small helpers ----------
async function getUserByEmail(email) {
  const rows = await query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
  return rows[0] ?? null;
}

async function getUserBySession(token) {
  const rows = await query(
    'SELECT * FROM users WHERE session_token = ? AND session_expiration > NOW() LIMIT 1',
    [token]
  );
  return rows[0] ?? null;
}

async function setUserSession(userId) {
  const token = uuidv4();
  const expires = new Date();
  expires.setDate(expires.getDate() + SESSION_DAYS);
  await query(
    'UPDATE users SET session_token = ?, session_expiration = ? WHERE id = ?',
    [token, expires, userId]
  );
  return { token, expires };
}

async function clearUserSession(userId) {
  await query('UPDATE users SET session_token = NULL, session_expiration = NULL WHERE id = ?', [userId]);
}

// ---------- main API ----------
export async function login(email, password) {
  try {
    const user = await getUserByEmail(email);
    // Do not leak which field failed
    if (!user) return { success: false, message: 'Invalid email or password' };

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return { success: false, message: 'Invalid email or password' };

    const { token } = await setUserSession(user.id);
    // do not return password hash
    const { password_hash, ...safeUser } = user;
    return { success: true, token, user: safeUser };
  } catch (err) {
    console.error('Login error:', err);
    return { success: false, message: 'Server error during login' };
  }
}

export async function register(email, username, password) {
  try {
    // rely on DB unique constraints but give nice messages
    const existing = await query(
      'SELECT email, username FROM users WHERE email = ? OR username = ? LIMIT 1',
      [email, username]
    );
    if (existing.length) {
      const taken = existing[0];
      if (taken.email === email) return { success: false, message: 'Email already in use' };
      if (taken.username === username) return { success: false, message: 'Username already in use' };
    }

    const password_hash = await bcrypt.hash(password, 12);
    const result = await query(
      'INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)',
      [email, username, password_hash]
    );

    const { token } = await setUserSession(result.insertId);
    return { success: true, token, message: 'User created successfully' };
  } catch (err) {
    // handle unique constraint race
    if (err && err.code === 'ER_DUP_ENTRY') {
      return { success: false, message: 'Email or username already in use' };
    }
    console.error('Registration error:', err);
    return { success: false, message: 'Server error during registration' };
  }
}

export async function validateSession(token) {
  try {
    if (!token) return null;
    const user = await getUserBySession(token);
    if (!user) return null;
    const { password_hash, ...safeUser } = user;
    return safeUser;
  } catch (err) {
    console.error('Session validation error:', err);
    return null;
  }
}

export async function logoutByToken(token) {
  try {
    const user = await getUserBySession(token);
    if (user) await clearUserSession(user.id);
  } catch (err) {
    console.error('Logout error:', err);
  }
}
