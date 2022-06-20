import Prismic from "@prismicio/client";

const apiEndpoint = "https://ig-news-2.cdn.prismic.io/api/v2";

const accessToken = process.env.PRISMIC_ACCESS_TOKEN;

export function getPrismicClient(req?: unknown) {
  const prismic = Prismic.client(apiEndpoint, {
    accessToken: accessToken,
  });

  return prismic;
}
