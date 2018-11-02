import React from 'react';
import { ShopSection, Shop } from './EtsyApi';

type Props = {
  shop: Shop;
  section: ShopSection;
};

function first<T>(list: T[]) {
  if (!list[0]) {
    throw new Error('Empty list');
  }

  return list[0];
}

export default function WorkList(props: Props) {
  return (
    <>
      {props.shop.Listings.map(listing => {
        const image = first(listing.Images);

        return (
          <div>
            <img src={image.url_fullxfull} />
            <pre>{JSON.stringify(listing, null, 2)}</pre>
          </div>
        );
      })}
    </>
  );
}
