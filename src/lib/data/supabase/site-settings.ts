import type { SiteSettings, SiteSettingsRepo } from "../types";
import { DEFAULT_SITE_SETTINGS } from "../types";
import { getClient } from "./client";

function rowToSiteSettings(r: Record<string, unknown>): SiteSettings {
  return {
    siteName: (r.site_name as string) || DEFAULT_SITE_SETTINGS.siteName,
    siteNameEn: (r.site_name_en as string) || DEFAULT_SITE_SETTINGS.siteNameEn,
    logoText: (r.logo_text as string) || DEFAULT_SITE_SETTINGS.logoText,
    logoTextEn: (r.logo_text_en as string) || DEFAULT_SITE_SETTINGS.logoTextEn,
    logoImageUrl: (r.logo_image_url as string | null) ?? null,
    contactName: (r.contact_name as string) || DEFAULT_SITE_SETTINGS.contactName,
    contactPhone: (r.contact_phone as string) || DEFAULT_SITE_SETTINGS.contactPhone,
    contactEmail: (r.contact_email as string) || DEFAULT_SITE_SETTINGS.contactEmail,
    contactWhatsApp:
      (r.contact_whatsapp as string) || DEFAULT_SITE_SETTINGS.contactWhatsApp,
    contactAddress:
      (r.contact_address as string) || DEFAULT_SITE_SETTINGS.contactAddress,
    contactAddressEn:
      (r.contact_address_en as string) || DEFAULT_SITE_SETTINGS.contactAddressEn,
    socialX: (r.social_x as string) || "",
    socialInstagram: (r.social_instagram as string) || "",
    socialFacebook: (r.social_facebook as string) || "",
    socialYoutube: (r.social_youtube as string) || "",
    socialTiktok: (r.social_tiktok as string) || "",
    socialLinkedin: (r.social_linkedin as string) || "",
    copyrightText:
      (r.copyright_text as string) || DEFAULT_SITE_SETTINGS.copyrightText,
    copyrightTextEn:
      (r.copyright_text_en as string) || DEFAULT_SITE_SETTINGS.copyrightTextEn,
    copyrightUrl: (r.copyright_url as string) || DEFAULT_SITE_SETTINGS.copyrightUrl,
    updatedAt: (r.updated_at as string) || new Date().toISOString(),
  };
}

export const supabaseSiteSettingsRepo: SiteSettingsRepo = {
  async get() {
    const db = getClient();
    const { data, error } = await db
      .from("site_settings")
      .select("*")
      .eq("id", "default")
      .single();
    if (error) throw error;
    if (!data) return { ...DEFAULT_SITE_SETTINGS };
    return rowToSiteSettings(data as Record<string, unknown>);
  },

  async update(input) {
    const db = getClient();
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (input.siteName !== undefined) patch.site_name = input.siteName;
    if (input.siteNameEn !== undefined) patch.site_name_en = input.siteNameEn;
    if (input.logoText !== undefined) patch.logo_text = input.logoText;
    if (input.logoTextEn !== undefined) patch.logo_text_en = input.logoTextEn;
    if (input.logoImageUrl !== undefined) patch.logo_image_url = input.logoImageUrl;
    if (input.contactName !== undefined) patch.contact_name = input.contactName;
    if (input.contactPhone !== undefined) patch.contact_phone = input.contactPhone;
    if (input.contactEmail !== undefined) patch.contact_email = input.contactEmail;
    if (input.contactWhatsApp !== undefined) {
      patch.contact_whatsapp = input.contactWhatsApp;
    }
    if (input.contactAddress !== undefined) patch.contact_address = input.contactAddress;
    if (input.contactAddressEn !== undefined) {
      patch.contact_address_en = input.contactAddressEn;
    }
    if (input.socialX !== undefined) patch.social_x = input.socialX;
    if (input.socialInstagram !== undefined) {
      patch.social_instagram = input.socialInstagram;
    }
    if (input.socialFacebook !== undefined) patch.social_facebook = input.socialFacebook;
    if (input.socialYoutube !== undefined) patch.social_youtube = input.socialYoutube;
    if (input.socialTiktok !== undefined) patch.social_tiktok = input.socialTiktok;
    if (input.socialLinkedin !== undefined) patch.social_linkedin = input.socialLinkedin;
    if (input.copyrightText !== undefined) patch.copyright_text = input.copyrightText;
    if (input.copyrightTextEn !== undefined) {
      patch.copyright_text_en = input.copyrightTextEn;
    }
    if (input.copyrightUrl !== undefined) patch.copyright_url = input.copyrightUrl;
    const { data, error } = await db
      .from("site_settings")
      .upsert({ id: "default", ...patch }, { onConflict: "id" })
      .select()
      .single();
    if (error) throw error;
    return rowToSiteSettings(data as Record<string, unknown>);
  },
};
