import { useCallback } from "react";

export function getBase() {
    return "";
}

export function resolvePath(path = "") {
    return `/${path}`.replace(/\/+/g, "/");
}

export function asset(path = "") {
    return `/${path}`.replace(/\/+/g, "/");
}

export default function useBase() {
    return "";
}

export function useResolveHref() {
    return useCallback((path = "") => `/${path}`.replace(/\/+/g, "/"), []);
}
