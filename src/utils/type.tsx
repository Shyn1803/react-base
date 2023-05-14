interface IArticle {
  id: number;
  title: string;
  body: string;
}

type ArticleState = {
  articles: IArticle[];
};

type ArticleAction = {
  type: string;
  article: IArticle;
};

export type DispatchType = (args: ArticleAction) => ArticleAction;

interface IUser {
  id: number;
  username: string;
  email: string;
  image: string;
  bio: string;
}

type UserAction = {
  type: string;
  user: IUser;
};

export type DispatchUser = (args: IUser[]) => UserAction;
