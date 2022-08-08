import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { isMultiLanguage } from "../../lib/isMultiLanguage.js";
import {
  getCurrentLocaleStore,
  globalDrupalStateStores,
} from "../../lib/drupalStateContext";

import Layout from "../../components/layout";
import PageHeader from "../../components/page-header";
import Link from "next/link";

export default function PageListTemplate({
  hrefLang,
  pages,
  footerMenu,
  multiLanguage,
}) {
  const { locale } = useRouter();
  return (
    <Layout footerMenu={footerMenu}>
      <NextSeo
        title="Decoupled Next Drupal Demo"
        description="Generated by create next app."
        languageAlternates={hrefLang || false}
      />{" "}
      <PageHeader title="Pages" />
      <div className="mt-12 mx-auto max-w-[50vw]">
        <ul>
          {pages ? (
            pages?.map(({ id, title, body, path }) => (
              <li className="prose justify-items-start mt-8" key={id}>
                <h2>{title}</h2>
                <div dangerouslySetInnerHTML={{ __html: body?.summary }} />
                <Link
                  passHref
                  href={`${
                    multiLanguage ? `/${path?.langcode || locale}` : ""
                  }${path.alias}`}
                >
                  <a className="font-normal underline">Read more →</a>
                </Link>
              </li>
            ))
          ) : (
            <h2 className="text-xl text-center mt-14">No pages found 🏜</h2>
          )}
        </ul>
      </div>
    </Layout>
  );
}

export async function getStaticProps(context) {
  const origin = process.env.NEXT_PUBLIC_FRONTEND_URL;
  const { locales, locale } = context;
  // if there is more than one language in context.locales,
  // assume multilanguage is enabled.
  const multiLanguage = isMultiLanguage(locales);
  const hrefLang = locales.map((locale) => {
    return {
      hrefLang: locale,
      href: origin + "/" + locale,
    };
  });

  const store = getCurrentLocaleStore(locale, globalDrupalStateStores);

  try {
    const pages = await store.getObject({
      objectName: "node--page",
      query: `
      {
        id
        title
        body
        path {
          alias
          langcode
        }
      }
    `,
    });

    const footerMenu = await store.getObject({
      objectName: "menu_items--main",
    });

    if (!pages) {
      return { props: { footerMenu }, revalidate: 5 };
    }

    return {
      props: {
        pages,
        footerMenu,
        hrefLang,
        multiLanguage,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Unable to fetch data for pages: ", error);
    return {
      notFound: true,
      revalidate: 5,
    };
  }
}