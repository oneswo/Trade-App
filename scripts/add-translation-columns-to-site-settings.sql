alter table public.site_settings
  add column if not exists translation_provider text not null default '',
  add column if not exists translation_api_key text not null default '',
  add column if not exists translation_api_base_url text not null default '';
