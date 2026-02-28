import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
    theme: ThemeMode;
    setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<ThemeMode>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('susa-theme') as ThemeMode;
            if (saved) return saved;
        }
        return 'dark'; // Default
    });

    const setTheme = (newTheme: ThemeMode) => {
        setThemeState(newTheme);
        localStorage.setItem('susa-theme', newTheme);
        localStorage.setItem('susa-theme-manual', 'true');
    };

    useEffect(() => {
        const updateTheme = () => {
            if (localStorage.getItem('susa-theme-manual') === 'true') return;

            const now = new Date();
            const hour = now.getHours();

            // Auto-switch to dark mode after 8 PM (20:00) until 6 AM
            const isNight = hour >= 20 || hour < 6;
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            if (isNight) {
                setThemeState('dark');
            } else {
                setThemeState(systemPrefersDark ? 'dark' : 'light');
            }
        };

        updateTheme();
        const interval = setInterval(updateTheme, 60000);

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemChange = () => updateTheme();
        mediaQuery.addEventListener('change', handleSystemChange);

        return () => {
            clearInterval(interval);
            mediaQuery.removeEventListener('change', handleSystemChange);
        };
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);

        // Ensure body background matches theme immediately
        document.body.className = theme;
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
