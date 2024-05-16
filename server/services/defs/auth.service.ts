import type { IUser, IUserRegister } from "@/types/entity";

export interface IAuthService {
  validateToken(token: string): Promise<boolean>;
  login(email: string, password: string): Promise<string | null>;
  register(user: IUserRegister): Promise<void>;
  getUserFromToken(token: string): Promise<IUser>;
  AUTH_GUARD(event: any): any;
}
