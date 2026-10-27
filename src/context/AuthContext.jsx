import React, { createContext, useContext, useState, useEffect } from "react";

const USERS_KEY = "klassyar_users";
const CURRENT_KEY = "klassyar_user";

const AuthContext = createContext(null);

function getAllUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
  } catch {
    return {};
  }
}

function getStoredUser() {
  try {
    const raw = localStorage.getItem(CURRENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveUser(user) {
  if (user) {
    localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_KEY);
  }
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

async function hashPassword(password) {
  if (globalThis.crypto?.subtle) {
    const bytes = new TextEncoder().encode(password);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  // Old browsers still get a deterministic non-plaintext value.
  let hash = 2166136261;
  for (const char of password) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return `fallback-${(hash >>> 0).toString(16)}`;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getStoredUser());
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const users = getAllUsers();
    const stored = users[username.toLowerCase()];
    const passwordHash = await hashPassword(password);

    if (!stored || (stored.passwordHash !== passwordHash && stored.password !== password)) {
      throw new Error("نام کاربری یا رمز عبور اشتباه است");
    }

    // Migrate legacy local accounts after a successful login without losing access.
    if (!stored.passwordHash) {
      stored.passwordHash = passwordHash;
      delete stored.password;
      users[username.toLowerCase()] = stored;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    const userData = {
      id: stored.id,
      name: stored.name,
      username: username.toLowerCase(),
      createdAt: stored.createdAt,
    };
    saveUser(userData);
    setUser(userData);
    return userData;
  };

  const register = async (username, password) => {
    if (!username || username.length < 2) {
      throw new Error("نام کاربری باید حداقل ۲ کاراکتر باشد");
    }
    if (!password || password.length < 3) {
      throw new Error("رمز عبور باید حداقل ۳ کاراکتر باشد");
    }

    const users = getAllUsers();
    const key = username.toLowerCase();

    if (users[key]) {
      throw new Error("این نام کاربری قبلاً ثبت شده است");
    }

    const userData = {
      id: generateId(),
      name: username,
      username: key,
      passwordHash: await hashPassword(password),
      createdAt: new Date().toISOString(),
    };

    users[key] = userData;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const loginData = { id: userData.id, name: userData.name, username: userData.username, createdAt: userData.createdAt };
    saveUser(loginData);
    setUser(loginData);
    return loginData;
  };

  const logout = () => {
    saveUser(null);
    setUser(null);
  };

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthContext;
