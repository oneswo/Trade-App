import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getSiteSettingsRepo } from "@/lib/data/repository";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth/constants";
import { verifyToken } from "@/lib/auth/session";
import { deleteR2Objects, diffR2Urls } from "@/lib/storage/media-storage";

async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value ?? "";
  return token !== "" && verifyToken(token);
}

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const repo = getSiteSettingsRepo();
    const settings = await repo.get();
    return Response.json({ ok: true, data: settings });
  } catch (error) {
    console.error("Failed to get site settings:", error);
    return Response.json({ ok: false, error: "Failed to get settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const repo = getSiteSettingsRepo();
    const current = await repo.get();
    const settings = await repo.update(body);
    const staleUrls = diffR2Urls([current.logoImageUrl], [settings.logoImageUrl]);
    if (staleUrls.length > 0) {
      await deleteR2Objects(staleUrls);
    }
    revalidatePath('/api/site-settings');
    revalidatePath('/', 'layout');
    return Response.json({ ok: true, data: settings });
  } catch (error) {
    console.error("Failed to update site settings:", error);
    return Response.json({ ok: false, error: "Failed to update settings" }, { status: 500 });
  }
}
