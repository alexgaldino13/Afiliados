export interface Profile {
  id: string;
  updated_at?: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
  niche?: string;
  brand_voice?: string;
  affiliate_configs?: any;
}

export interface Product {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  title: string;
  price?: number;
  commission?: string;
  image_url?: string;
  description?: string;
  platform?: string;
  external_id?: string;
  affiliate_link?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Campaign {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  product_id?: string;
  title: string;
  image_url?: string;
  copy_aida?: any;
  business_dna?: any;
  status: 'draft' | 'processing' | 'ready' | 'failed';
  scheduled_at?: string;
  error_log?: string;
  progress: number;
}

export interface Asset {
  id: string;
  created_at: string;
  campaign_id: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  prompt?: string;
  metadata?: any;
}
