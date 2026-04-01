export * from "./types";

import {
  mockAdminAuthRepo,
  mockArticleRepo,
  mockCategoryRepo,
  mockInquiryRepo,
  mockPageContentRepo,
  mockProductRepo,
  mockSiteSettingsRepo,
  mockTicketRepo,
} from "./mock-repository";
import type {
  AdminAuthRepo,
  ArticleRepo,
  CategoryRepo,
  InquiryRepo,
  PageContentRepo,
  ProductRepo,
  SiteSettingsRepo,
  TicketRepo,
} from "./types";

function isSupabaseConfigured() {
  return !!(
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

function isMissingSiteSettingsTableError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const maybeError = error as { code?: unknown; message?: unknown };
  return (
    maybeError.code === "PGRST205" &&
    typeof maybeError.message === "string" &&
    maybeError.message.includes("public.site_settings")
  );
}

/* eslint-disable @typescript-eslint/no-require-imports */

export function getInquiryRepo(): InquiryRepo {
  if (isSupabaseConfigured()) {
    const { supabaseInquiryRepo } =
      require("./supabase-repository") as typeof import("./supabase-repository");
    return supabaseInquiryRepo;
  }
  return mockInquiryRepo;
}

export function getAdminAuthRepo(): AdminAuthRepo {
  if (isSupabaseConfigured()) {
    const { supabaseAdminAuthRepo } =
      require("./supabase-repository") as typeof import("./supabase-repository");
    return supabaseAdminAuthRepo;
  }
  return mockAdminAuthRepo;
}

export function getProductRepo(): ProductRepo {
  if (isSupabaseConfigured()) {
    const { supabaseProductRepo } =
      require("./supabase-repository") as typeof import("./supabase-repository");
    return supabaseProductRepo;
  }
  return mockProductRepo;
}

export function getArticleRepo(): ArticleRepo {
  if (isSupabaseConfigured()) {
    const { supabaseArticleRepo } =
      require("./supabase-repository") as typeof import("./supabase-repository");
    return supabaseArticleRepo;
  }
  return mockArticleRepo;
}

export function getTicketRepo(): TicketRepo {
  if (isSupabaseConfigured()) {
    const { supabaseTicketRepo } =
      require("./supabase-repository") as typeof import("./supabase-repository");
    if (supabaseTicketRepo) return supabaseTicketRepo;
  }
  return mockTicketRepo;
}

export function getCategoryRepo(): CategoryRepo {
  if (isSupabaseConfigured()) {
    const { supabaseCategoryRepo } =
      require("./supabase-repository") as typeof import("./supabase-repository");
    return supabaseCategoryRepo;
  }
  return mockCategoryRepo;
}

export function getPageContentRepo(): PageContentRepo {
  if (isSupabaseConfigured()) {
    const { supabasePageContentRepo } =
      require("./supabase-repository") as typeof import("./supabase-repository");
    return supabasePageContentRepo;
  }
  return mockPageContentRepo;
}

export function getSiteSettingsRepo(): SiteSettingsRepo {
  if (isSupabaseConfigured()) {
    const { supabaseSiteSettingsRepo } =
      require("./supabase-repository") as typeof import("./supabase-repository");
    return {
      async get() {
        try {
          return await supabaseSiteSettingsRepo.get();
        } catch (error) {
          if (isMissingSiteSettingsTableError(error)) {
            return mockSiteSettingsRepo.get();
          }
          throw error;
        }
      },
      async update(settings) {
        try {
          return await supabaseSiteSettingsRepo.update(settings);
        } catch (error) {
          if (isMissingSiteSettingsTableError(error)) {
            return mockSiteSettingsRepo.update(settings);
          }
          throw error;
        }
      },
    };
  }
  return mockSiteSettingsRepo;
}

/* eslint-enable @typescript-eslint/no-require-imports */
