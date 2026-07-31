import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
    children: React.ReactNode;
}

/**
 * Renders children directly into document.body via a React portal.
 * Use this for modals/overlays to escape CSS transform/filter containing blocks
 * (e.g. PageTransition wrapper) that break `position: fixed` behaviour.
 */
export default function Portal({ children }: PortalProps) {
    const [container] = useState(() => document.createElement("div"));

    useEffect(() => {
        document.body.appendChild(container);
        return () => {
            document.body.removeChild(container);
        };
    }, [container]);

    return createPortal(children, container);
}

