import { type ICommunitySettings } from "../../services/admin/CommunitySettingsServices";

/**
 * Ensures a URL string starts with a valid protocol (https:// or http://).
 */
export function ensureAbsoluteUrl(urlStr?: string): string | undefined {
    if (!urlStr || !urlStr.trim()) return undefined;
    const trimmed = urlStr.trim();
    if (/^https?:\/\//i.test(trimmed)) {
        return trimmed;
    }
    return `https://${trimmed}`;
}

/**
 * Recursively cleans an object by removing keys with undefined, null, empty strings, or empty objects/arrays.
 */
export function purgeEmptyFields(obj: any): any {
    if (obj === null || obj === undefined) return undefined;
    if (typeof obj === "string") {
        const trimmed = obj.trim();
        return trimmed.length > 0 ? trimmed : undefined;
    }
    if (Array.isArray(obj)) {
        const cleanedArr = obj
            .map((item) => purgeEmptyFields(item))
            .filter((item) => item !== undefined);
        return cleanedArr.length > 0 ? cleanedArr : undefined;
    }
    if (typeof obj === "object") {
        const cleanedObj: Record<string, any> = {};
        for (const [key, val] of Object.entries(obj)) {
            const cleanedVal = purgeEmptyFields(val);
            if (cleanedVal !== undefined) {
                cleanedObj[key] = cleanedVal;
            }
        }
        return Object.keys(cleanedObj).length > 0 ? cleanedObj : undefined;
    }
    return obj;
}

/**
 * Dynamically builds Schema.org Organization JSON-LD object from CommunitySettings.
 */
export function buildOrganizationSchema(settings?: Partial<ICommunitySettings> | null): Record<string, any> {
    const s = settings || {};

    const name = s.communityName || "";
    const alternateName = s.alternateName || "";
    const description = s.aboutCommunity || "";
    const websiteUrl = ensureAbsoluteUrl(s.websiteUrl);
    const logoUrl = ensureAbsoluteUrl(s.logoUrl);
    const primaryEmail = s.primaryEmail || "hivemindsist@gmail.com";
    const contactNumber = s.contactNumber || "";
    const foundedYear = s.foundedYear || "";
    const parentOrgName = s.parentOrganization || "";

    const streetAddress = s.streetAddress || "";
    const city = s.city || "";
    const state = s.state || "";
    const country = s.country || "";
    const postalCode = s.postalCode || "";

    const socialUrls = [
        ensureAbsoluteUrl(s.linkedin),
        ensureAbsoluteUrl(s.instagram),
        ensureAbsoluteUrl(s.github),
    ].filter(Boolean) as string[];

    const rawSchema: Record<string, any> = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name,
        alternateName,
        url: websiteUrl,
        logo: logoUrl,
        description,
        email: primaryEmail,
        telephone: contactNumber,
        foundingDate: foundedYear,
        parentOrganization: parentOrgName
            ? {
                  "@type": "EducationalOrganization",
                  name: parentOrgName,
              }
            : undefined,
        address: {
            "@type": "PostalAddress",
            streetAddress,
            addressLocality: city,
            addressRegion: state,
            addressCountry: country,
            postalCode,
        },
        sameAs: socialUrls,
    };

    return purgeEmptyFields(rawSchema) || {};
}

/**
 * Returns formatted JSON-LD string representation of Organization Schema.
 */
export function getOrganizationSchemaJson(settings?: Partial<ICommunitySettings> | null): string {
    const schemaObj = buildOrganizationSchema(settings);
    return JSON.stringify(schemaObj, null, 2);
}
