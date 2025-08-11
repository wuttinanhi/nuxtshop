import {Address, DatabaseSingleton, User} from "~/server/databases/database";
import {UserRole} from "~/shared/enums/userrole.enum";
import {IUser, IUserInfo} from "~/types/entity";
import {IUserService} from "../defs/user.service";

export class UserServiceORM implements IUserService {
    findById(id: number): Promise<IUser | null> {
        return User.findByPk(id, {
            include: [{model: Address, as: "address"}],
        });
    }

    findByEmail(email: string): Promise<IUser | null> {
        return User.findOne({
            where: {email},
            include: [{model: Address, as: "address"}],
        });
    }

    async updateInfo(info: IUserInfo): Promise<void> {
        const transaction = await DatabaseSingleton.getDatabase().transaction();
        try {
            // find the user by id
            const user = await User.findByPk(info.id);
            if (!user) throw new Error("User to update not found");
            
            // update the user
            user.firstName = info.firstName;
            user.lastName = info.lastName;
            user.email = info.email;

            await user.save();

            // find the address by id
            const address = await Address.findOne({where: {userId: user.id}});
            if (!address) throw new Error("Address to update not found");

            // update the address
            address.addressText = info.address.addressText;
            address.city = info.address.city;
            address.state = info.address.state;
            address.zip = info.address.zip;

            await address.save();

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async setRole(user: IUser, role: UserRole): Promise<void> {
        await User.update({role}, {where: {id: user.id}});
        console.log(`User ${user.email} role updated to ${role}`);
    }
}
