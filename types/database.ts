export type UserRole = 'owner' | 'manager' | 'editor' | 'viewer';

export type MenuCategory = {
  id: string;
  restaurant_id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type MenuItem = {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  price_cents: number;
  image_url: string | null;
  dietary_tags: string[];
  is_featured: boolean;
  is_available: boolean;
  created_at: string;
  updated_at: string;
};

export type MediaAsset = {
  id: string;
  restaurant_id: string;
  public_id: string;
  url: string;
  alt: string;
  folder: 'menu' | 'gallery' | 'brand';
  width: number | null;
  height: number | null;
  created_at: string;
};

export type ThemeSettings = {
  restaurant_id: string;
  brand_name: string;
  primary_color: string;
  accent_color: string;
  background_color: string;
  typography: 'serif' | 'sans' | 'editorial';
  updated_at: string;
};

export type SeoSettings = {
  restaurant_id: string;
  title: string;
  description: string;
  og_image: string | null;
  keywords: string[];
  updated_at: string;
};

export type Profile = {
  id: string;
  restaurant_id: string;
  email: string;
  role: UserRole;
  created_at: string;
};


export type BuilderBlockType = 'section' | 'heading' | 'paragraph' | 'image' | 'button' | 'spacer';

export type BuilderBlock = {
  id: string;
  type: BuilderBlockType;
  parent_id: string | null;
  sort_order: number;
  content: string;
  image_url: string | null;
  href: string | null;
  styles: {
    height?: number;
    align?: 'left' | 'center' | 'right';
    tone?: 'dark' | 'glass' | 'gold';
  };
};

export type BuilderPage = {
  id: string;
  restaurant_id: string;
  slug: string;
  title: string;
  status: 'draft' | 'published';
  blocks: BuilderBlock[];
  created_at: string;
  updated_at: string;
};

export type BuilderVersion = {
  id: string;
  page_id: string;
  version_number: number;
  title: string;
  blocks: BuilderBlock[];
  created_by: string | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      menu_categories: { Row: MenuCategory; Insert: Omit<MenuCategory, 'created_at' | 'updated_at'> & { id?: string }; Update: Partial<Omit<MenuCategory, 'id' | 'created_at' | 'updated_at'>> };
      menu_items: { Row: MenuItem; Insert: Omit<MenuItem, 'created_at' | 'updated_at'> & { id?: string }; Update: Partial<Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>> };
      media_assets: { Row: MediaAsset; Insert: Omit<MediaAsset, 'created_at'> & { id?: string }; Update: Partial<Omit<MediaAsset, 'id' | 'created_at'>> };
      theme_settings: { Row: ThemeSettings; Insert: Omit<ThemeSettings, 'updated_at'>; Update: Partial<Omit<ThemeSettings, 'restaurant_id' | 'updated_at'>> };
      seo_settings: { Row: SeoSettings; Insert: Omit<SeoSettings, 'updated_at'>; Update: Partial<Omit<SeoSettings, 'restaurant_id' | 'updated_at'>> };
      profiles: { Row: Profile; Insert: Omit<Profile, 'created_at'>; Update: Partial<Omit<Profile, 'id' | 'created_at'>> };
      builder_pages: { Row: BuilderPage; Insert: Omit<BuilderPage, 'created_at' | 'updated_at'>; Update: Partial<Omit<BuilderPage, 'id' | 'created_at' | 'updated_at'>> };
      builder_versions: { Row: BuilderVersion; Insert: Omit<BuilderVersion, 'id' | 'created_at'>; Update: Partial<Omit<BuilderVersion, 'id' | 'created_at'>> };
    };
  };
};
