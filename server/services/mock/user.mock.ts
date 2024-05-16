import { UserRole } from "~/shared/enums/userrole.enum";
import { IUser } from "~/types/entity";
import { IUserService } from "../defs/user.service";

export class UserServiceMock implements IUserService {
  async findById(id: number): Promise<IUser | null> {
    return this.mockUser();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.mockUser();
  }

  private mockUser(): IUser {
    return {
      id: 1,
      email: "john@example.com",
      firstName: "John",
      lastName: "Doe",
      address: {
        addressText: "123 Main St",
        city: "Springfield",
        state: "IL",
        zip: "62701",
      },
      role: UserRole.ADMIN,
      addressId: 1,
    };
  }
}
