export interface CredentialDTO {
  id: number;
  name: string;
  login: string;
  email: string;
  roles: Array<string>;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  refreshExpiresIn: number;
  status: boolean;
}
