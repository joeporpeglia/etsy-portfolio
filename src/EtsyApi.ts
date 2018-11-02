export type ListingImage = {
  listing_image_id: number;
  hex_code: string;
  listing_id: number;
  rank: number;
  url_75x75: string;
  url_170x135: string;
  url_570xN: string;
  url_fullxfull: string;
  full_height: number;
  full_width: number;
};

export type Listing = {
  listing_id: number;
  state: string;
  title?: string;
  description?: string;
  price?: string;
  tags?: string[];
  category_path?: string[];
  taxonomy_path?: string[];
  materials?: string[];
  shop_section_id?: number | null;
  featured_rank?: number | null;
  url: string;
  item_length: string;
  item_width: string;
  item_height: string;
  is_private: boolean;
  Images: ListingImage[];
};

export type ShopSection = {
  shop_section_id: number;
  title: string;
  rank: number;
  active_listing_count: number;
};

export type Shop = {
  announcement: string;
  listing_active_count: number;
  url: string;
  icon_url_fullxfull: string;
  Sections: ShopSection[];
  Listings: Listing[];
};

export type User = {
  bio: string;
  materials: string;
  avatar_id: number;
  image_url_75x75: string;
  first_name: string;
  last_name: string;
};

enum ListingState {
  Active = 'active',
  Removed = 'removed',
  SoldOut = 'sold_out',
  Expired = 'expired',
  Alchemy = 'alchemy',
  Edit = 'edit',
  Create = 'create',
  Private = 'private',
  Unavailable = 'unavailable'
}

export { ListingState };
