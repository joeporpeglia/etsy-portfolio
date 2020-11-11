import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  fetchShop,
  fetchUser,
  getListing,
  getShopSection,
  getShopSectionFromSlug,
  Listing,
  ShopSection,
} from "src/etsy/api";
import { slugify } from "src/routing/slugify";
import styles from "src/home/styles.module.css";

type AppProps = {
  name: string;
  bio: string;
  navLinks: { url: string; title: string }[];
  featuredImages: { src: string; width: number; height: number; alt: string }[];
  shopSection: ShopSection | null;
  listing: Listing | null;
};

export default function App(props: AppProps) {
  const { name, bio, navLinks, featuredImages, shopSection, listing } = props;
  const pageTitle = getPageTitle(name, shopSection, listing);
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  return (
    <main className={styles.pageLayout}>
      <Head>
        <title>{pageTitle}</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <h1 className={styles.name}>
        <Link href="/">
          <a>{name}</a>
        </Link>
      </h1>
      <p className={styles.bio}>{bio}</p>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {navLinks.map((navLink) => (
            <li key={navLink.url} className={styles.navItem}>
              <Link href={navLink.url}>
                <a>{navLink.title}</a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <ul className={styles.featuredImageList}>
        {featuredImages.map((imgProps) => (
          <li key={imgProps.src} className={styles.featuredImageItem}>
            <Image {...imgProps} />
          </li>
        ))}
      </ul>
    </main>
  );
}

function getPageTitle(
  name: string,
  shopSection: ShopSection | null,
  listing: Listing | null
) {
  if (listing) {
    return `${listing.title} - ${name}`;
  }

  if (shopSection) {
    return `${shopSection.title} - ${name}`;
  }

  return `Home - ${name}`;
}

export async function getStaticProps(
  context: GetStaticPropsContext<{ slug: string[] }>
): Promise<GetStaticPropsResult<AppProps>> {
  const [user, shop] = await Promise.all([fetchUser(), fetchShop()]);
  const slug = context.params?.slug ?? [];

  let shopSection = null;
  if (slug[0]) {
    shopSection = getShopSectionFromSlug(shop, slug[0]);

    if (!shopSection) {
      return { notFound: true };
    }
  }

  let listing = null;
  if (slug[1]) {
    listing = getListing(shop, slug[1]);

    if (!listing || listing.shop_section_id !== shopSection?.shop_section_id) {
      return { notFound: true };
    }
  }

  const featuredImages = shop.Listings.slice()
    .sort(() => (Math.random() > 0.5 ? 1 : -1))
    .slice(0, 6)
    .map((listing) => ({
      src: listing.Images[0].url_fullxfull,
      alt: listing.title ?? "No description",
      width: listing.Images[0].full_width,
      height: listing.Images[0].full_height,
    }));

  return {
    props: {
      name: [user.first_name, user.last_name].join(" "),
      bio: user.bio,
      navLinks: shop.Sections.map((section) => ({
        url: `/${slugify(section.title)}`,
        title: section.title,
      })),
      featuredImages,
      shopSection,
      listing,
    },
    revalidate: 3600, // revalidate once per hour
  };
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const shop = await fetchShop();

  const homePath = {
    params: {
      slug: [],
    },
  };

  const shopSectionPaths = shop.Sections.map((section) => ({
    params: {
      slug: [slugify(section.title)],
    },
  }));

  const listingPaths = shop.Listings.map((listing) => ({
    params: {
      slug: [
        slugify(getShopSection(shop, String(listing.shop_section_id))?.title!),
        String(listing.listing_id),
      ],
    },
  }));

  return {
    paths: [homePath, ...shopSectionPaths, ...listingPaths],
    fallback: true,
  };
}
