import Image from "next/image";
import Link from "next/link";
import Layout from "../../components/layout";
import { DrupalState } from "@pantheon-systems/drupal-kit";
import { NextSeo } from "next-seo";
import { isMultiLanguage } from "../../lib/isMultiLanguage";

const drupalUrl = process.env.backendUrl;

// TODO - Much of this is duplicated in the article/[id].js file. Abstract this out into modules and components.
export default function Home({ page, hrefLang }) {
  return (
    <Layout>
      <NextSeo
        title="Decoupled Next Drupal Demo"
        description="Generated by create next app."
        languageAlternates={hrefLang}
      />
      <article className="prose lg:prose-xl mt-10 mx-auto">
        <h1>{page.title}</h1>

        <Link passHref href="/pages">
          <a className="font-normal">Pages &rarr;</a>
        </Link>

        <div className="mt-12 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-screen-lg">
          <div dangerouslySetInnerHTML={{ __html: page.body.value }} />
        </div>
      </article>
    </Layout>
  );
}

export async function getStaticPaths(context) {
  const multiLanguage = isMultiLanguage(context.locales);
  // TODO - locale increases the complexity enough here that creating a usePaths
  // hook would be a good idea.
  // Get paths for each locale.
  const pathsByLocale = context.locales.map(async (locale) => {
    const store = new DrupalState({
      apiBase: drupalUrl,
      defaultLocale: multiLanguage ? locale : "",
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    });

    const pages = await store.getObject({
      objectName: "node--page",
      query: `
        {
          id
          path {
            alias
          }
        }
      `,
    });
    return pages.map((page) => {
      const path = page.path.alias.substring(1);
      return { params: { alias: path }, locale: locale };
    });
  });

  // Resolve all promises returned as part of pathsByLocale.
  const paths = await Promise.all(pathsByLocale).then((values) => {
    // Flatten the array of arrays into a single array.
    return [].concat(...values);
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const multiLanguage = isMultiLanguage(context.locales);
  const store = new DrupalState({
    apiBase: drupalUrl,
    defaultLocale: multiLanguage ? context.locale : "",
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });

  const page = await store.getObjectByPath({
    objectName: "node--page",
    path: `${multiLanguage ? context.locale : ""}/${context.params.alias}`,
    query: `
        {
          id
          title
          body
          path {
            alias
          }
        }
      `,
  });

  const origin = process.env.NEXT_PUBLIC_FRONTEND_URL;
  const { locales } = context;
  // Load all the paths for the current page content type.
  const paths = locales.map(async (locale) => {
    const storeByLocales = new DrupalState({
      apiBase: drupalUrl,
      defaultLocale: multiLanguage ? locale : "",
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    });
    const { path } = await storeByLocales.getObject({
      objectName: "node--page",
      id: page.id,
    });
    return path;
  });

  // Resolve all promises returned as part of paths
  // and prepare hrefLang.
  const hrefLang = await Promise.all(paths).then((values) => {
    return values.map((value) => {
      return {
        hrefLang: value.langcode,
        href: origin + "/" + value.langcode + value.alias,
      };
    });
  });

  return {
    props: {
      page: page,
      hrefLang,
      revalidate: 60,
    },
  };
}
