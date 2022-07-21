import { AuthTokenModel } from './auth-token-model';
import { Entity } from './entity';
import { LoginModel } from './login-model';

export interface RescueDumpServerModel extends Entity<number> {
  id: number;

  name: string;

  baseUrl: string;
  
  authToken: AuthTokenModel | null;

  displayed: boolean;

  login: LoginModel;
}