import React from 'react';
import { IPost } from '../typings';
import Post from './Post';

interface Props {
  posts: [IPost];
}

function Posts({ posts }: Props) {
  return (
    <div>
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
}

export default Posts;
