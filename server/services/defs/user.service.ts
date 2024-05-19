import type { IUser, IUserInfo } from "@/types/entity";
import { UserRole } from "~/shared/enums/userrole.enum";

export interface IUserService {
  findById(id: number): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  updateInfo(user: IUserInfo): Promise<void>;
  setRole(user: IUser, role: UserRole): Promise<void>;
}
