import Head from 'next/head';
import Banner from '../components/Banner';
import Header from '../components/Header';
import Posts from '../components/Posts';
import { sanityClient, urlFor } from '../sanity';
import { IPost } from '../typings';

interface Props {
  posts: [IPost];
}

// const Home: NextPage = (props) => {
export default function Home({ posts }: Props) {
  return (
    <div className="mx-auto max-w-7xl">
      <Head>
        <title>Cogent X Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <Header />
        <Banner />
      </header>

      {/* Posts Section */}
      <Posts posts={posts} />
    </div>
  );
}

// Enable SSR in Next.js for this page
export const getServerSideProps = async () => {
  // fetch data from Sanity backend
  const query = `*[_type == "post"] {
  _id,
  title,
  author->{
  name,
  image
},
description,
mainImage,
slug
}`;

  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts,
    },
  };
};
