import Link from 'next/link';
import { urlFor } from '../sanity';
import { IPost } from '../typings';

interface IProps {
  post: IPost;
}

function Post({ post }: IProps) {
  return (
    <Link key={post._id} href={`/posts/${post.slug.current}`}>
      <div>
        {/* if mainImage.asset.url exists render image | '!' at end of url() assures TypeScript value will exist */}
        {post.mainImage && <img src={urlFor(post.mainImage).url()!} alt="post image" />}
      </div>
    </Link>
  );
}

export default Post;
