import type { ProductMediaSlot } from "@/lib/products/media";
import type { ProductMetricValues } from "@/lib/data/types";

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
  descriptionZh: string;
  descriptionEn: string;
}

export interface ProductEditorCoreMetrics extends ProductMetricValues {
  yearZh: string;
  yearEn: string;
  hoursZh: string;
  hoursEn: string;
  tonnageZh: string;
  tonnageEn: string;
  locationZh: string;
  locationEn: string;
  modelZh: string;
  modelEn: string;
  brandZh: string;
  brandEn: string;
  mediaSlots?: ProductMediaSlot[];
}

export interface ProductEditorSpec {
  keyZh: string;
  keyEn: string;
  valueZh: string;
  valueEn: string;
}
