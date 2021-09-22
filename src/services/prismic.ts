import Prismic from '@prismicio/client'

const apiEndpoint = 'https://ig-news-2.cdn.prismic.io/api/v2'

const accessToken = process.env.PRISMIC_ACCESS_TOKEN

export const client = Prismic.client(apiEndpoint, {
  accessToken
})