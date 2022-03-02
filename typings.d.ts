export interface IPost {
  _id: string;
  _createdAt: string;
  title: string;
  author: {
    name: string;
    image: string;
  };
  comments: [Comment];
  description: string;
  mainImage: {
    asset: {
      url: string;
    };
  };
  slug: {
    current: string;
  };
  body: [object];
}

export interface Comment {
  approved: boolean;
  comment: string;
  name: string;
  email: string;
  post: {
    _ref: string;
    _type: string;
  };
  _createdAt: string;
  _updatedAt: string;
  _id: string;
  _rev: string;
  _type: string;
}

export interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}
