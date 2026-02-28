import { useTheme } from '../context/ThemeContext';

export type { ThemeMode } from '../context/ThemeContext';

export const useThemeIntelligence = () => {
    return useTheme();
};
