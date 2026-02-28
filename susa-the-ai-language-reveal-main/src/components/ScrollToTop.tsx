import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop — mounted inside BrowserRouter.
 * On every route change, it forcibly resets any scroll/position state
 * that browsers may have stored when navigating between pages.
 *
 * This is the definitive fix for the "home page position shifts after
 * visiting a sub-page" issue caused by body position:fixed scroll bleed.
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Reset all positional state that browsers track with position:fixed
        try {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
        } catch {
            window.scrollTo(0, 0);
        }

        // Clear the browser's stored top offset (position:fixed scroll side-effect)
        document.body.style.top = '0px';
        document.body.style.left = '0px';
        document.documentElement.style.top = '0px';
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, [pathname]);

    return null;
};

export default ScrollToTop;
