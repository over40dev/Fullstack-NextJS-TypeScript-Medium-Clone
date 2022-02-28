import Link from 'next/link';
import { urlFor } from '../sanity';
import { IPost } from '../typings';

interface IProps {
  post: IPost;
}

function Post({ post }: IProps) {
  return (
    <Link key={post._id} href={`/posts/${post.slug.current}`}>
      <div className="group border rounded-lg cursor-pointer overflow-hidden">
        {/* if mainImage.asset.url exists render image | '!' at end of url() assures TypeScript value will exist */}
        {post.mainImage && (
          <img
            className="h-60 w-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-105"
            src={urlFor(post.mainImage).url()!}
            alt="post image"
          />
        )}
        <div className="flex justify-between bg-white p-5">
          <div>
            <p className="text-lg font-bold">{post.title}</p>
            <p className="text-xs">
              {post.description} by {post.author.name}
            </p>
          </div>
          {post.author.image && (
            <img className="h-12 w-12 rounded-full" src={urlFor(post.author.image).url()!} alt="author image" />
          )}
        </div>
      </div>
    </Link>
  );
}

export default Post;
