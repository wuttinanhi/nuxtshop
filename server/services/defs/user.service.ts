import type { IUser } from "@/types/entity";

export interface IUserService {
  findById(id: number): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
}
