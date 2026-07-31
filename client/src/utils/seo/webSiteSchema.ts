import { type ICommunitySettings } from "../../services/admin/CommunitySettingsServices";
import { ensureAbsoluteUrl, purgeEmptyFields } from "./organizationSchema";

/**
 * Dynamically builds Schema.org WebSite JSON-LD object from CommunitySettings.
 */
export function buildWebSiteSchema(settings?: Partial<ICommunitySettings> | null): Record<string, any> {
    const s = settings || {};

    const name = s.communityName || "";
    const description = s.aboutCommunity || "";
    const websiteUrl = ensureAbsoluteUrl(s.websiteUrl);
    const logoUrl = ensureAbsoluteUrl(s.logoUrl);

    const rawSchema: Record<string, any> = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name,
        url: websiteUrl,
        description,
        inLanguage: "en",
        publisher: {
            "@type": "Organization",
            name,
            url: websiteUrl,
            logo: logoUrl,
        },
    };

    return purgeEmptyFields(rawSchema) || {};
}

/**
 * Returns formatted JSON-LD string representation of WebSite Schema.
 */
export function getWebSiteSchemaJson(settings?: Partial<ICommunitySettings> | null): string {
    const schemaObj = buildWebSiteSchema(settings);
    return JSON.stringify(schemaObj, null, 2);
}
