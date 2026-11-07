"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Session } from "../../lib/types";

type AuthContextValue = {
    user: Session | null;
    loading: boolean;
    refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: {children: React.ReactNode}) {
    const [user, setUser] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        try {
            const res = await fetch("/api/auth/me");
            setUser(res.ok?await res.json() : null);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return (
        <AuthContext.Provider value = {{ user, loading, refresh }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("Something went wrong");
    return context;
}