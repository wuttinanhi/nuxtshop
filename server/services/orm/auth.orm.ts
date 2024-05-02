import { UserRole } from "@/shared/enums/userrole.enum";
import type { IAddress, IUser } from "@/types/entity";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Address, DatabaseSingleton, User } from "~/server/databases/database";
import type { IAuthService } from "../defs/auth.service";

export class AuthServiceORM implements IAuthService {
  public async createAdminUser() {
    console.log("Checking for admin user");

    let adminUser = await User.findOne({
      where: { email: "admin@example.com" },
    });

    if (adminUser) return;

    console.log("Creating admin user");

    const adminAddress: IAddress = {
      address: "123 Admin St",
      city: "Adminville",
      state: "AD",
      zip: "12345",
    };

    await this.register({
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      password: "admin-password",
      role: UserRole.ADMIN,
      address: adminAddress,
    });

    console.log("Admin user created");
  }

  constructor() {
    // create a default admin user if one doesn't exist
    this.createAdminUser();
  }

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

  public async register(user: IUser): Promise<void> {
    if (!user.password) {
      throw new Error("User password is required when registering");
    }

    const transaction = await DatabaseSingleton.getDatabase().transaction();
    let newUser: User;

    try {
      const userAddress = await Address.create(user.address, { transaction });
      const hashedPassword = this.hashPassword(user.password);

      newUser = await User.create(
        {
          firstName: "Admin",
          lastName: "User",
          email: "admin@example.com",
          password: hashedPassword,
          role: UserRole.ADMIN,
          address: userAddress,
        },
        { transaction }
      );

      transaction.commit();

      console.log(`User ${newUser.email} created`);
    } catch (error) {
      console.error("Error loading products", error);
      transaction.rollback();
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
