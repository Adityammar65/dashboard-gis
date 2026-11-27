import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useAppRouter() {
    const navigate = useNavigate();
    const location = useLocation();

    const go = useCallback((path, options = {}) => {
        if (!path) return;
        navigate(path.startsWith("/") ? path : `/${path}`, options);
    }, [navigate]);

    return {
        go,
        path: location.pathname,
        url: `${location.pathname}${location.search}`,
        back: () => navigate(-1),
    };
}
