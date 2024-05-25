import { UserRole } from "@/shared/enums/userrole.enum";
import type { IUser, IUserRegister } from "@/types/entity";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ValidationError } from "sequelize";
import { Address, DatabaseSingleton, User } from "~/server/databases/database";
import type { IAuthService } from "../defs/auth.service";

export class AuthServiceORM implements IAuthService {
  private static getJWTSecret(): string {
    return process.env.JWT || "secret";
  }

  public async validateToken(token: string): Promise<boolean> {
    const result = jwt.verify(token, AuthServiceORM.getJWTSecret());
    return !!result;
  }

  public async getUserFromToken(token: string): Promise<IUser> {
    const decoded = jwt.verify(token, AuthServiceORM.getJWTSecret());
    return decoded as IUser;
  }

  private signJWTToken(user: IUser): string {
    const signObj = (user as User).toJSON();
    signObj.password = undefined;
    return jwt.sign(signObj, AuthServiceORM.getJWTSecret());
  }

  private verifyPassword(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }

  private hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  public async login(email: string, password: string): Promise<string | null> {
    const user = await User.findOne({
      where: { email },
      attributes: { include: ["password"] },
    });

    if (!user) {
      return null;
    }

    const compareResult = this.verifyPassword(password, user.password);
    if (!compareResult) {
      return null;
    }

    const token = this.signJWTToken(user);

    return token;
  }

  public async register(user: IUserRegister): Promise<void> {
    if (!user.password) {
      throw new Error("User password is required when registering");
    }

    if (!user.address) {
      throw new Error("User address is required when registering");
    }

    const transaction = await DatabaseSingleton.getDatabase().transaction();
    try {
      const hashedPassword = this.hashPassword(user.password);

      const newUser = await User.create(
        {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: hashedPassword,
          role: UserRole.USER,
        },
        { transaction }
      );

      const userAddress = await Address.create(
        {
          addressText: user.address.addressText,
          city: user.address.city,
          state: user.address.state,
          zip: user.address.zip,
          userId: newUser.id,
        },
        { transaction }
      );

      console.log(`Address created with id ${userAddress.id}`);

      transaction.commit();

      console.log(`User ${newUser.email} created`);
    } catch (error) {
      transaction.rollback();
      const validationError = error as ValidationError;
      throw validationError;
    }
  }

  public async AUTH_GUARD(event: any) {
    const authorization = event.headers.get("authorization");
    if (!authorization) {
      throw new Error("Unauthorized");
    }

    const token = authorization.split(" ")[1];
    if (!token || !(await this.validateToken(token))) {
      throw new Error("Unauthorized");
    }

    return token;
  }
}
