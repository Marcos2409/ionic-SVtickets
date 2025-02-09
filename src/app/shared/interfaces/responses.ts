import { MyEvent } from './my-event';
import { User } from './user';

export interface EventsResponse {
  events: MyEvent[];
  more: boolean;
  page: number;
  count: number;
}

export interface SingleEventResponse {
  event: MyEvent;
}

export interface SingleUserResponse {
  user: User;
}

export interface AvatarResponse {
  avatar: string;
}

export interface UserResponse {
  user: User;
}

export interface UsersResponse {
  users: User[];
}

export interface MyCommentInsert {
  comment: string;
}

export interface Comment {
  id?: number;
  text: string;
  date?: string;
  user?: User;
}

export interface CommentsResponse {
  comments: SingleCommentResponse[];
}

export interface SingleCommentResponse {
  id: number;
  comment: MyCommentInsert;
  date: string;
  user: User;
}

export interface TokenResponse {
  accessToken: string;
}