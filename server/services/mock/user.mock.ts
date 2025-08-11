import {UserRole} from "~/shared/enums/userrole.enum";
import {IUser, IUserInfo} from "~/types/entity";
import {IUserService} from "../defs/user.service";

export class UserServiceMock implements IUserService {
    updateInfo(user: IUserInfo): Promise<void> {
        throw new Error("Method not implemented.");
    }

    setRole(user: IUser, role: UserRole): Promise<void> {
        throw new Error("Method not implemented.");
    }

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
