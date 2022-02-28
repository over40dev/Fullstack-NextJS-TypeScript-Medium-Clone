import React from 'react';
import { IPost } from '../typings';
import Post from './Post';

interface Props {
  posts: [IPost];
}

function Posts({ posts }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 p-2 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:p-6">
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
}

export default Posts;
