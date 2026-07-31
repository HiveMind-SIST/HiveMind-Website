import { useEffect } from "react";
import { useCommunitySettings } from "../utils/hooks";
import { getWebSiteSchemaJson } from "../utils/seo/webSiteSchema";

const SCRIPT_ID = "website-jsonld";

export default function WebSiteSchema() {
    const { settings } = useCommunitySettings();

    useEffect(() => {
        let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
        const schemaJson = getWebSiteSchemaJson(settings);

        if (!script) {
            script = document.createElement("script");
            script.id = SCRIPT_ID;
            script.type = "application/ld+json";
            script.textContent = schemaJson;
            document.head.appendChild(script);
        } else {
            if (script.textContent !== schemaJson) {
                script.textContent = schemaJson;
            }
        }
    }, [settings]);

    return null;
}
