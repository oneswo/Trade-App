export interface CategoryOption {
  slug: string;
  nameZh: string;
  nameEn: string;
}

export interface ProductEditorContent {
  nameZh: string;
  nameEn: string;
  summaryZh: string;
  summaryEn: string;
}

export interface ProductEditorCoreMetrics {
  year: string;
  hours: string;
  tonnage: string;
  location: string;
  model: string;
  brand: string;
}

export interface ProductEditorSpec {
  key: string;
  value: string;
}
