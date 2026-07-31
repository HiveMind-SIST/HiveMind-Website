import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BASE_URL = "https://hivemindsist.dev";

export default function CanonicalTag() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Exclude admin routes or dynamic non-indexable routes from setting main canonicals if needed
        if (pathname.startsWith("/admin")) {
            return;
        }

        // Clean trailing slash for consistency except for root route
        const cleanPath = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
        const canonicalUrl = `${BASE_URL}${cleanPath}`;

        let link = document.querySelector<HTMLLinkElement>("link[rel='canonical']");
        if (!link) {
            link = document.createElement("link");
            link.setAttribute("rel", "canonical");
            document.head.appendChild(link);
        }
        link.setAttribute("href", canonicalUrl);
    }, [pathname]);

    return null;
}
