import { AuthTokenModel } from './auth-token-model';
import { LoginModel } from './login-model';

export type RescueDumpServerModel = {
  id: number,
  name: string;
  baseUrl: string;
  authToken: AuthTokenModel | null,
  displayed: boolean,
  login: LoginModel
}