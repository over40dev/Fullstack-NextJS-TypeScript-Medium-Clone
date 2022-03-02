import { GetStaticProps } from 'next/types';
import React from 'react';
import PortableText from 'react-portable-text';
import { useForm, SubmitHandler } from 'react-hook-form';
import Header from '../../components/Header';
import { sanityClient, urlFor } from '../../sanity';
import { IPost } from '../../typings';

interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}
interface Props {
  post: IPost;
}

function PostPage({ post }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    await fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log(data);
      })
      .catch((err) => console.log(err));
  };

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

      <hr className="my-5 mx-auto max-w-lg border border-yellow-500" />

      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mb-10 flex max-w-2xl flex-col p-5">
        <h3 className="text-sm text-yellow-500">Enjoyed the article?</h3>
        <h4 className="text-3xl font-bold">Leave a comment below!</h4>
        <hr className="mt-2 py-3" />

        <input type="hidden" {...register('_id')} name="_id" value={post._id} />

        <label className="mb-5 block">
          <span className="text-gray-700">Name</span>
          <input
            className="focus:rin block w-full rounded border py-2 px-3  shadow outline-none ring-yellow-500 focus:ring"
            placeholder="J Doe"
            type="text"
            {...register('name', { required: true })}
          />
        </label>
        <label className="mb-5 block">
          <span className="text-gray-700">Email</span>
          <input
            className="focus:rin block w-full rounded border py-2 px-3  shadow outline-none ring-yellow-500 focus:ring"
            placeholder="j@doe.com"
            type="email"
            {...register('email', { required: true })}
          />
        </label>
        <label className="mb-5 block">
          <span className="text-gray-700">Comment</span>
          <textarea
            className="form-textarea mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring"
            placeholder="Your comments please..."
            rows={8}
            {...register('comment', { required: true })}
          />
        </label>

        {/* errors will return when field validation fails */}
        <div>
          {errors.name && <span className="text-red-500">- Name field is required</span>}
          {errors.email && <span className="text-red-500">- Email field is required</span>}
          {errors.comment && <span className="text-red-500">- Comment field is required</span>}
        </div>

        <input
          type="submit"
          className="focus:shadow-outline cursor-pointer rounded bg-yellow-500 py-2 px-4 font-bold text-white shadow hover:bg-yellow-400 focus:outline-none"
        />
      </form>
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
