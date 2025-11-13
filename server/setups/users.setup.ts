import { UserRole } from "~/shared/enums/userrole.enum";
import { IAddress } from "~/types/entity";
import { User } from "../databases/database";
import { ServiceKit } from "../services/service.kit";

export class UserSetup {
  public static async checkAdminUser() {
    console.log("UserSetup->checkAdminUser: Checking for admin user");

    const serviceKit = await ServiceKit.get();

    let adminUser = await User.findOne({
      where: { email: "admin@example.com" },
    });

    if (adminUser) {
      console.log("Admin user already exists. Skipping creation.");
      return;
    }

    console.log("Admin user not found. Creating...");

    const adminAddress: IAddress = {
      addressText: "123 Admin St",
      city: "Admin ville",
      state: "AD",
      zip: "12345",
    };

    await serviceKit.authService.register({
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      password: "admin",
      role: UserRole.ADMIN,
      address: adminAddress,
    });

    const updatedAdminUser = await serviceKit.userService.findByEmail(
      "admin@example.com"
    );
    if (!updatedAdminUser) {
      console.log("Failed to get admin user");
      return;
    }

    await serviceKit.userService.setRole(updatedAdminUser, UserRole.ADMIN);

    console.log("Admin user created");
  }
}
