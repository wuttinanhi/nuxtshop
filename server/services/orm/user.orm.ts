import { User } from "~/server/databases/database";
import { IUser } from "~/types/entity";
import { IUserService } from "../defs/user.service";

export class UserServiceORM implements IUserService {
  findById(id: number): Promise<IUser | null> {
    return User.findByPk(id);
  }

  findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ where: { email } });
  }
}
