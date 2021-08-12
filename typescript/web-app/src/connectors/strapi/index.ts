export type Article = {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  published_at: string;
  description: string;
  content: string;
  category: {
    id: string;
    name: string;
  };
  image: {
    url: string;
  };
  author: {
    name: string;
    picture: {
      url: string;
    };
  };
};

async function fetchAPI(
  query: string,
  { variables }: { variables?: { [key: string]: any } } = {}
) {
  const res = await fetch(`https://strapi.labelflow.ai/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error("Failed to fetch API");
  }

  return json.data;
}

export async function getPreviewArticleBySlug(slug: string): Promise<{
  articles: Pick<Article, "slug">[];
}> {
  const data = await fetchAPI(
    `
    query ArticleBySlug($where: JSON) {
      articles(where: $where) {
        slug
      }
    }
    `,
    {
      variables: {
        where: {
          slug,
        },
      },
    }
  );
  return data?.articles[0];
}

export async function getAllArticlesWithSlug(): Promise<{
  articles: Pick<Article, "slug">[];
}> {
  const data = await fetchAPI(`
      {
        articles {
          slug
        }
      }
    `);
  return data?.allArticles;
}

export async function getAllArticles({
  limit,
}: {
  limit?: number;
}): Promise<Omit<Article, "content">[]> {
  const data = await fetchAPI(
    `
    query Articles ($limit:Int){
        articles(sort: "created_at:desc", limit: $limit, publicationState:LIVE) {
          id
          title
          slug
          created_at
          published_at
          description
          category {
            id
            name
          }
          image {
            url
          }
          author {
            name
            picture {
              url
            }
          }
        }
      }
      `,
    { variables: { limit } }
  );
  return data?.articles;
}

export async function getArticle(
  slug: string
): Promise<{ articles: Article; moreArticles: Omit<Article, "content">[] }> {
  const data = await fetchAPI(
    `
    query ArticleBySlug($where: JSON, $where_ne: JSON) {
      articles(where: $where, publicationState:LIVE) {
          id
          title
          slug
          created_at
          published_at
          content
          description
          category {
            id
            name
          }
          image {
            url
          }
          author {
            name
            picture {
              url
            }
          }
        }
      }
      moreArticles: articles(sort: "created_at:desc", limit: 3, where: $where_ne, publicationState:LIVE) {
          id
          title
          slug
          created_at
          published_at
          description
          category {
            id
            name
          }
          image {
            url
          }
          author {
            name
            picture {
              url
            }
          }
        }
      }
    }
    `,
    {
      variables: {
        where: {
          slug,
        },
        where_ne: {
          slug_ne: slug,
        },
      },
    }
  );
  return data;
}
