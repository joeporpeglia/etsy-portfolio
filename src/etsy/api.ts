import { slugify } from "src/routing/slugify";

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
  title?: string;
  description?: string;
  shop_section_id: number;
  url: string;
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

export enum ListingState {
  Active = "active",
  Removed = "removed",
  SoldOut = "sold_out",
  Expired = "expired",
  Alchemy = "alchemy",
  Edit = "edit",
  Create = "create",
  Private = "private",
  Unavailable = "unavailable",
}

type EtsyResponse<Result> = {
  results: Result[];
};

const host = "https://openapi.etsy.com/v2";
const apiKey = process.env.API_KEY;
const userId = process.env.USER_ID;
const shopId = process.env.SHOP_ID;

export async function fetchUser(): Promise<User> {
  console.log("fetching user");

  const fields = "bio,image_url_75x75,first_name,last_name";

  const response = await fetch(
    `${host}/users/${userId}/profile?api_key=${apiKey}&fields=${fields}`
  );

  if (!response.ok) {
    throw new Error("Failed to call etsy api");
  }

  const etsyResponse: EtsyResponse<User> = await response.json();

  return etsyResponse.results[0];
}

export async function fetchShop(): Promise<Shop> {
  console.log("fetching shop");

  const shopFields = "announcement,listing_active_count,url,icon_url_fullxfull";
  const shopSectionFields = "shop_section_id,title,rank,active_listing_count";
  const listingFields =
    "listing_id,state,title,description,price,tags,category_path,taxonomy_path,materials,shop_section_id,featured_rank,url,item_length,item_width,item_height,is_private";
  const listingImageFields =
    "listing_image_id,hex_code,listing_id,rank,url_75x75,url_170x135,url_570xN,url_fullxfull,full_height,full_width";

  const response = await fetch(
    `${host}/shops/${shopId}?api_key=${apiKey}&limit=1&fields=${shopFields}&includes=Sections(${shopSectionFields}):100,Listings(${listingFields}):active:100/Images(${listingImageFields}):100`
  );

  if (!response.ok) {
    throw new Error("Failed to call etsy api");
  }

  const etsyResponse: EtsyResponse<Shop> = await response.json();

  return etsyResponse.results[0];
}

export function getShopSection(shop: Shop, shopSectionId: string) {
  return (
    shop.Sections.find(
      (section) => String(section.shop_section_id) === shopSectionId
    ) ?? null
  );
}

export function getShopSectionFromSlug(shop: Shop, slug: string) {
  return (
    shop.Sections.find((section) => slugify(section.title) === slug) ?? null
  );
}

export function getListing(shop: Shop, listingId: string) {
  return (
    shop.Listings.find((listing) => String(listing.listing_id) === listingId) ??
    null
  );
}
