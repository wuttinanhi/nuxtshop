export class ClientAuthService {
  public static getToken(): string {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }
    return token;
  }

  public static async getUserData() {
    try {
      const token = this.getToken();

      // console.log("using token", token);
      // get user data
      const res: any = await $fetch("/api/accounts/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      return res;
    } catch (error) {
      throw new Error("User not found");
    }
  }
}
