export interface  User {
  id: number;
  name: string;
  email?: string;
  function?: string;
  accessToken: string;
  password?: string;
  login: string;
  refreshToken: string;
  expiresIn: number;
}
