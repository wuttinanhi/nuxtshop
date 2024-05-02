import type { IUser } from "@/types/entity";

export interface IAuthService {
  validateToken(token: string): Promise<boolean>;
  login(email: string, password: string): Promise<string | null>;
  getUserFromToken(token: string): Promise<IUser>;
  AUTH_GUARD(event: any): any;
}
