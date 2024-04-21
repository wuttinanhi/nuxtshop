import { User } from "~/types/general";

export async function validateToken(token: string): Promise<boolean> {
  return token === "valid-token";
}

export async function getUserFromToken(token: string): Promise<User> {
  return {
    id: 1,
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
    address: {
      address: "123 Main St",
      city: "Springfield",
      state: "IL",
      zip: "62701",
    },
  };
}

export async function login(
  email: string,
  password: string
): Promise<string | null> {
  if (email === "john@example.com" && password === "password") {
    return "valid-token";
  }
  return null;
}

export async function AUTH_GUARD(event: any) {
  const authorization = event.headers.get("authorization");
  if (!authorization) {
    throw new Error("Unauthorized");
  }

  const token = authorization.split(" ")[1];
  if (!token || !(await validateToken(token))) {
    throw new Error("Unauthorized");
  }

  return token;
}
