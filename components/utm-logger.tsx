"use client";

import { useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function UtmLoggerContent() {
    const searchParams = useSearchParams();
    const hasTracked = useRef(false);

    useEffect(() => {
        if (hasTracked.current) return;

        const utmParams: Record<string, string> = {};
        let hasUtms = false;

        // Capture all utm_ parameters
        searchParams.forEach((value, key) => {
            if (key.startsWith("utm_") || key === "ref") {
                utmParams[key] = value;
                hasUtms = true;
            }
        });

        const referrer = document.referrer;
        const isExternal = referrer && !referrer.includes(window.location.hostname);

        if (hasUtms || isExternal) {
            hasTracked.current = true;

            const payload = {
                ...utmParams,
                referrer,
                resolution: `${window.screen.width}x${window.screen.height}`,
                path: window.location.pathname,
                timestamp: new Date().toISOString(),
            };

            fetch("/api/track", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            }).catch((err) => console.error("Analytics error:", err));
        }
    }, [searchParams]);

    return null;
}

export function UtmLogger() {
    return (
        <Suspense fallback={null}>
            <UtmLoggerContent />
        </Suspense>
    );
}
