import { User } from "~/types/general";

export interface IAuthService {
  validateToken(token: string): Promise<boolean>;
  login(email: string, password: string): Promise<string | null>;
  getUserFromToken(token: string): Promise<User>;
  AUTH_GUARD(event: any): any;
}
