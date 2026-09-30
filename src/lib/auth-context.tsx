/**
 * REAL JOB — Auth Context
 * Handles authentication for USER, ADMIN, and SUPER_ADMIN roles.
 * Data is persisted in localStorage.
 */

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "user" | "admin" | "superadmin";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  mobile?: string;
  profilePhoto?: string;
  createdAt: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_KEY = "realjob_auth_user";
const USERS_KEY = "realjob_users_db";
const ACTIVITY_KEY = "realjob_activity_logs";

// ─── Seed initial accounts ───────────────────────────────────────────────────
function seedUsers() {
  const existing = localStorage.getItem(USERS_KEY);
  if (existing) return;

  const seed = [
    {
      id: "superadmin-001",
      email: "superadmin@realjob.in",
      password: "superadmin123",
      name: "Super Administrator",
      role: "superadmin" as UserRole,
      mobile: "9000000001",
      createdAt: new Date().toISOString(),
      disabled: false,
    },
    {
      id: "admin-001",
      email: "admin@realjob.in",
      password: "admin123",
      name: "Portal Admin",
      role: "admin" as UserRole,
      mobile: "9000000002",
      createdAt: new Date().toISOString(),
      disabled: false,
    },
    {
      id: "user-001",
      email: "user@realjob.in",
      password: "user123",
      name: "Demo User",
      role: "user" as UserRole,
      mobile: "9000000003",
      createdAt: new Date().toISOString(),
      disabled: false,
    },
  ];

  localStorage.setItem(USERS_KEY, JSON.stringify(seed));
}

// ─── Activity logger ──────────────────────────────────────────────────────────
export function logActivity(action: string, userId: string, userName: string, details?: string) {
  const logs = JSON.parse(localStorage.getItem(ACTIVITY_KEY) || "[]");
  logs.unshift({
    id: `log-${Date.now()}`,
    action,
    userId,
    userName,
    details: details || "",
    timestamp: new Date().toISOString(),
  });
  // keep last 500 logs
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(logs.slice(0, 500)));
}

// ─── Auth Provider ────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    seedUsers();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const users: any[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!found) {
      return { success: false, error: "Invalid email or password." };
    }
    if (found.disabled) {
      return { success: false, error: "Your account has been disabled. Please contact support." };
    }

    const authUser: AuthUser = {
      id: found.id,
      email: found.email,
      name: found.name,
      role: found.role,
      mobile: found.mobile,
      profilePhoto: found.profilePhoto,
      createdAt: found.createdAt,
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
    setUser(authUser);
    logActivity("LOGIN", found.id, found.name, `Logged in as ${found.role}`);
    return { success: true };
  };

  const logout = () => {
    if (user) logActivity("LOGOUT", user.id, user.name);
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  };

  const updateUser = (updates: Partial<AuthUser>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    localStorage.setItem(AUTH_KEY, JSON.stringify(updated));
    setUser(updated);

    // also update in users DB
    const users: any[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

// ─── Users DB helpers ─────────────────────────────────────────────────────────
export function getAllUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]") as any[];
}

export function saveUsers(users: any[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getActivityLogs() {
  return JSON.parse(localStorage.getItem(ACTIVITY_KEY) || "[]") as any[];
}
