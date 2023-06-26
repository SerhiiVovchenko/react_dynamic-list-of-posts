import { Comment } from '../types/Comment';
import { Post } from '../types/Post';

type NewComment = {
  postId: number | undefined,
  name: string,
  email: string,
  body: string,
};

const BASE_URL = 'https://mate.academy/students-api';

// a promise resolved after a given delay
function wait(delay: number) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

// To have autocompletion and avoid mistypes
type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

function request<T>(
  url: string,
  method: RequestMethod = 'GET',
  data: any = null, // we can send any data to the server
): Promise<T> {
  const options: RequestInit = { method };

  if (data) {
    // We add body and Content-Type only for the requests with data
    options.body = JSON.stringify(data);
    options.headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    };
  }

  // for a demo purpose we emulate a delay to see if Loaders work
  return wait(300)
    .then(() => fetch(BASE_URL + url, options))
    .then(response => response.json());
}

export const client = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, data: any) => request<T>(url, 'POST', data),
  patch: <T>(url: string, data: any) => request<T>(url, 'PATCH', data),
  delete: (url: string) => request(url, 'DELETE'),
};

export const customFetch = {
  getUserFromServer: () => client.get('/users'),
  getPostFromServer: (userId: number) => client.get<Post[]>(`/posts?userId=${userId}`),
  getPostComments: (postId: number) => client.get<Comment[]>(`/comments?postId=${postId}`),
  addComment: (newComment: NewComment) => (
    client.post<Comment>('/comments', newComment)),
  removeComment: (idComment: number) => client.delete(`/comments/${idComment}`),
};
