import { useEffect, useState } from "react";
import CommunitySettingsServices, { type ICommunitySettings } from "../services/admin/CommunitySettingsServices";

/**
 * Hook to set fixed background image on body element and clean up on unmount.
 */
export function useBodyBackground(imagePath: string) {
    useEffect(() => {
        document.body.style.backgroundImage = `url('${imagePath}')`;
        document.body.style.backgroundAttachment = "fixed";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundRepeat = "no-repeat";

        return () => {
            document.body.style.backgroundImage = "";
            document.body.style.backgroundAttachment = "";
            document.body.style.backgroundSize = "";
            document.body.style.backgroundPosition = "";
            document.body.style.backgroundRepeat = "";
        };
    }, [imagePath]);
}

/**
 * Hook to fetch and return community settings with loading status.
 */
export function useCommunitySettings() {
    const [settings, setSettings] = useState<ICommunitySettings | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        CommunitySettingsServices.getSettings()
            .then((res) => {
                if (isMounted && res && res.success && res.settings) {
                    setSettings(res.settings);
                }
            })
            .catch(() => {})
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return { settings, loading };
}


