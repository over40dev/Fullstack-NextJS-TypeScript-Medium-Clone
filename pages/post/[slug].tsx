import { GetStaticProps } from 'next/types';
import React from 'react';
import Header from '../../components/Header';
import { sanityClient, urlFor } from '../../sanity';
import { IPost } from '../../typings';

interface Props {
  post: IPost;
}

function PostPage({ post }: Props) {
  return (
    <main>
      <Header />

      <img src={urlFor(post.mainImage).url()} alt="post banner image" className="h-40 w-full object-cover" />
    </main>
  );
}

export default PostPage;

export const getStaticPaths = async () => {
  const query = `
  *[_type == "post"] {
    _id,
    slug {
      current
    }
  }
`;

  const posts = await sanityClient.fetch(query);
  const paths = posts.map((post: IPost) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `
*[_type == "post" && slug.current == $slug][0] {
  _id,
  _createdAt,
  title,
  author -> {
  name,
  image,
},
description,
mainImage,
slug,
body
}
  `;

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 60, // enables ISR - update cache after 60s
  };
};
