export type InquiryStatus = "PENDING" | "CONTACTED" | "CLOSED";

export interface InquiryRecord {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  locale: string;
  source: string | null;
  pagePath: string | null;
  isRead: boolean;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInquiryInput {
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  locale: string;
  source?: string | null;
  pagePath?: string | null;
}

export interface InquiryRepo {
  create(input: CreateInquiryInput): Promise<InquiryRecord>;
  list(): Promise<InquiryRecord[]>;
  markRead(id: string): Promise<InquiryRecord | null>;
}

export interface AdminRecord {
  id: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface AdminAuthRepo {
  findByEmail(email: string): Promise<AdminRecord | null>;
}

export type ProductStatus = "DRAFT" | "PUBLISHED";

export interface ProductSpec {
  key: string;
  value: string;
}

export interface ProductRecord {
  id: string;
  name: string;
  slug: string;
  category: string;
  summary: string;
  description: string;
  specs: ProductSpec[];
  coverImageUrl: string | null;
  galleryImageUrls: string[];
  videoUrl: string | null;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  slug: string;
  category: string;
  summary: string;
  description: string;
  specs: ProductSpec[];
  coverImageUrl?: string | null;
  galleryImageUrls?: string[];
  videoUrl?: string | null;
  status?: ProductStatus;
}

export interface UpdateProductInput {
  name?: string;
  slug?: string;
  category?: string;
  summary?: string;
  description?: string;
  specs?: ProductSpec[];
  coverImageUrl?: string | null;
  galleryImageUrls?: string[];
  videoUrl?: string | null;
  status?: ProductStatus;
}

export interface ProductRepo {
  list(): Promise<ProductRecord[]>;
  findById(id: string): Promise<ProductRecord | null>;
  findBySlug(slug: string): Promise<ProductRecord | null>;
  create(input: CreateProductInput): Promise<ProductRecord>;
  update(id: string, input: UpdateProductInput): Promise<ProductRecord | null>;
  remove(id: string): Promise<boolean>;
}

interface MockStore {
  inquiries: InquiryRecord[];
  admins: AdminRecord[];
  products: ProductRecord[];
}

declare global {
  var __kxtjMockStore__: MockStore | undefined;
}

function createInitialStore(): MockStore {
  return {
    inquiries: [],
    admins: [
      {
        id: "admin-local-1",
        email: "admin@kxtj.com",
        password: "admin123456",
        createdAt: new Date().toISOString(),
      },
    ],
    products: [
      {
        id: "prod_local_1",
        name: "KXTJ-360 Hydraulic Excavator",
        slug: "kxtj-360-hydraulic-excavator",
        category: "Large Excavators",
        summary: "36T heavy excavator, export-ready stock in Shanghai.",
        description:
          "KXTJ-360 is built for high-load construction projects and mining operations.",
        specs: [
          { key: "Operating Weight", value: "36,000 kg" },
          { key: "Engine Power", value: "212 kW" },
        ],
        coverImageUrl: "/images/products/1.jpg",
        galleryImageUrls: ["/images/products/1.jpg", "/images/products/2.jpg"],
        videoUrl: null,
        status: "PUBLISHED",
        createdAt: new Date("2026-03-20T08:00:00.000Z").toISOString(),
        updatedAt: new Date("2026-03-20T08:00:00.000Z").toISOString(),
      },
      {
        id: "prod_local_2",
        name: "KXTJ-220 Compact Excavator",
        slug: "kxtj-220-compact-excavator",
        category: "Mini Excavators",
        summary: "Compact machine for city construction and tight spaces.",
        description:
          "KXTJ-220 balances fuel efficiency and digging force for mid-sized projects.",
        specs: [
          { key: "Operating Weight", value: "22,000 kg" },
          { key: "Engine Power", value: "124 kW" },
        ],
        coverImageUrl: "/images/products/3.jpg",
        galleryImageUrls: ["/images/products/3.jpg"],
        videoUrl: null,
        status: "DRAFT",
        createdAt: new Date("2026-03-22T09:30:00.000Z").toISOString(),
        updatedAt: new Date("2026-03-22T09:30:00.000Z").toISOString(),
      },
    ],
  };
}

function getMockStore(): MockStore {
  if (!globalThis.__kxtjMockStore__) {
    globalThis.__kxtjMockStore__ = createInitialStore();
  }
  return globalThis.__kxtjMockStore__;
}

const mockInquiryRepo: InquiryRepo = {
  async create(input) {
    const now = new Date().toISOString();
    const record: InquiryRecord = {
      id: `inq_${crypto.randomUUID()}`,
      name: input.name,
      email: input.email,
      phone: input.phone,
      message: input.message,
      locale: input.locale,
      source: input.source ?? null,
      pagePath: input.pagePath ?? null,
      isRead: false,
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
    };

    const store = getMockStore();
    store.inquiries.unshift(record);

    return record;
  },

  async list() {
    const store = getMockStore();
    return [...store.inquiries].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async markRead(id) {
    const store = getMockStore();
    const inquiry = store.inquiries.find((item) => item.id === id);
    if (!inquiry) return null;

    inquiry.isRead = true;
    inquiry.updatedAt = new Date().toISOString();
    return inquiry;
  },
};

const mockAdminAuthRepo: AdminAuthRepo = {
  async findByEmail(email) {
    const store = getMockStore();
    return store.admins.find((admin) => admin.email === email) ?? null;
  },
};

function cloneProduct(record: ProductRecord): ProductRecord {
  return {
    ...record,
    specs: record.specs.map((spec) => ({ ...spec })),
    galleryImageUrls: [...record.galleryImageUrls],
  };
}

const mockProductRepo: ProductRepo = {
  async list() {
    const store = getMockStore();
    return [...store.products]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .map(cloneProduct);
  },

  async findById(id) {
    const store = getMockStore();
    const product = store.products.find((item) => item.id === id);
    return product ? cloneProduct(product) : null;
  },

  async findBySlug(slug) {
    const store = getMockStore();
    const target = slug.trim().toLowerCase();
    const product = store.products.find(
      (item) => item.slug.trim().toLowerCase() === target
    );
    return product ? cloneProduct(product) : null;
  },

  async create(input) {
    const now = new Date().toISOString();
    const record: ProductRecord = {
      id: `prod_${crypto.randomUUID()}`,
      name: input.name,
      slug: input.slug,
      category: input.category,
      summary: input.summary,
      description: input.description,
      specs: input.specs.map((spec) => ({ ...spec })),
      coverImageUrl: input.coverImageUrl ?? null,
      galleryImageUrls: [...(input.galleryImageUrls ?? [])],
      videoUrl: input.videoUrl ?? null,
      status: input.status ?? "DRAFT",
      createdAt: now,
      updatedAt: now,
    };

    const store = getMockStore();
    store.products.unshift(record);
    return cloneProduct(record);
  },

  async update(id, input) {
    const store = getMockStore();
    const product = store.products.find((item) => item.id === id);

    if (!product) return null;

    if (typeof input.name === "string") product.name = input.name;
    if (typeof input.slug === "string") product.slug = input.slug;
    if (typeof input.category === "string") product.category = input.category;
    if (typeof input.summary === "string") product.summary = input.summary;
    if (typeof input.description === "string")
      product.description = input.description;
    if (Array.isArray(input.specs)) {
      product.specs = input.specs.map((spec) => ({ ...spec }));
    }
    if (Array.isArray(input.galleryImageUrls)) {
      product.galleryImageUrls = [...input.galleryImageUrls];
    }
    if ("coverImageUrl" in input) {
      product.coverImageUrl = input.coverImageUrl ?? null;
    }
    if ("videoUrl" in input) {
      product.videoUrl = input.videoUrl ?? null;
    }
    if (input.status) {
      product.status = input.status;
    }

    product.updatedAt = new Date().toISOString();

    return cloneProduct(product);
  },

  async remove(id) {
    const store = getMockStore();
    const index = store.products.findIndex((item) => item.id === id);

    if (index < 0) return false;

    store.products.splice(index, 1);
    return true;
  },
};

export function getInquiryRepo(): InquiryRepo {
  return mockInquiryRepo;
}

export function getAdminAuthRepo(): AdminAuthRepo {
  return mockAdminAuthRepo;
}

export function getProductRepo(): ProductRepo {
  return mockProductRepo;
}
