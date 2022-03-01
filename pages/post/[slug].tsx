import { GetStaticProps } from 'next/types';
import React from 'react';
import Header from '../../components/Header';
import { sanityClient, urlFor } from '../../sanity';
import { IPost } from '../../typings';
import PortableText from 'react-portable-text';

interface Props {
  post: IPost;
}

function PostPage({ post }: Props) {
  return (
    <main>
      <Header />

      <img src={urlFor(post.mainImage).url()} alt="post banner image" className="h-40 w-full object-cover" />

      <article className="mx-auto max-w-3xl p-5">
        <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
        <h2 className="mb-2 text-xl font-light text-gray-500">{post.description}</h2>

        <div className="flex items-center space-x-2">
          <img className="h-10 w-10 rounded-full" src={urlFor(post.author.image).url()} alt="author image" />
          <p className="text-sm font-extralight">
            Blog post by <span className="text-green-600">{post.author.name}</span> - Published at{' '}
            {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>

        <div className="mt-10">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_DATASET}
            content={post.body}
            serializers={{
              h1: (props: any) => <h1 className="my-5 text-2xl font-bold" {...props} />,
              h2: (props: any) => <h2 className="my-5 text-xl font-bold" {...props} />,
              li: ({ children }: any) => <li className="ml-4 list-disc">{children}</li>,
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
              image: (props: any) => (
                <figure>
                  <img className="" src={urlFor(props.asset)?.url()} alt="author image" />
                </figure>
              ),
            }}
          />
        </div>
      </article>
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
