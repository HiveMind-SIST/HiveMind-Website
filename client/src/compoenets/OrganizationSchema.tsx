import { useEffect } from "react";
import { useCommunitySettings } from "../utils/hooks";
import { getOrganizationSchemaJson } from "../utils/seo/organizationSchema";

const SCRIPT_ID = "organization-jsonld";

export default function OrganizationSchema() {
    const { settings } = useCommunitySettings();

    useEffect(() => {
        let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
        const schemaJson = getOrganizationSchemaJson(settings);

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
