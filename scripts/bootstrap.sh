#!/bin/bash
source secrets.sh


API_HOST=https://openapi.etsy.com/v2
USER_FIELDS=bio,materials,avatar_id,image_url_75x75,first_name,last_name
SHOP_FIELDS=announcement,listing_active_count,url,icon_url_fullxfull
SHOP_SECTION_FIELDS=shop_section_id,title,rank,active_listing_count
LISTING_FIELDS=listing_id,state,title,description,price,tags,category_path,taxonomy_path,materials,shop_section_id,featured_rank,url,item_length,item_width,item_height,is_private
LISTING_IMAGE_FIELDS=listing_image_id,hex_code,listing_id,rank,url_75x75,url_170x135,url_570xN,url_fullxfull,full_height,full_width

mkdir -p src;

if [ ! -f src/user.json ]; then
    curl "$API_HOST/users/$USER_ID/profile?api_key=$API_KEY&fields=$USER_FIELDS" > src/user.json
fi

if [ ! -f src/shop.json ]; then
    curl "$API_HOST/shops/$SHOP_ID?api_key=$API_KEY&limit=1&fields=$SHOP_FIELDS&includes=Sections($SHOP_SECTION_FIELDS):100,Listings($LISTING_FIELDS):active:100/Images($LISTING_IMAGE_FIELDS):100" > src/shop.json
fi

if [ ! -f src/settings.json ]; then
    curl "$SITE_SETTINGS_URL" > src/settings.json
fi
