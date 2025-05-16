import React, {createContext, useContext, useState, useEffect} from 'react';
import {jwtDecode} from 'jwt-decode';

type User = {
    id: string;
    email: string;
    roles: string[];
    isAdmin: boolean;
    isEmployee: boolean;
};

type AuthContextType = {
    user: User | null;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    login: () => {
    },
    logout: () => {
    },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    // Read from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                const decoded: any = jwtDecode(storedToken);

                if (decoded.exp && decoded.exp < Date.now() / 1000) {
                    logout(); // Token expired
                    return;
                }

                const isAdmin = decoded.roles.includes('ROLE_ADMIN');
                const isEmployee = decoded.roles.includes('ROLE_EMPLOYEE') || isAdmin;

                setUser({
                    email: decoded.username,
                    id: decoded.sub,
                    roles: decoded.roles,
                    isAdmin,
                    isEmployee
                });
                setToken(storedToken); // Only set if valid
            } catch (e) {
                logout(); // Invalid token
            }
        }
    }, []);

    const login = (newToken: string) => {
        try {
            const decoded: any = jwtDecode(newToken);

            if (decoded.exp && decoded.exp < Date.now() / 1000) {
                throw new Error("Token is expired");
            }

            const isAdmin = decoded.roles.includes('ROLE_ADMIN');
            const isEmployee = decoded.roles.includes('ROLE_EMPLOYEE') || isAdmin;

            const newUser: User = {
                email: decoded.username,
                id: decoded.sub,
                roles: decoded.roles,
                isAdmin,
                isEmployee
            };

            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(newUser);
        } catch (e) {
            logout();
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{user, token, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
