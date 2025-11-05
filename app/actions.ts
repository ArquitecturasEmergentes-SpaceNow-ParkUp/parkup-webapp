"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { endpoints } from "../lib/config";
import config from "../lib/config";

export interface User {
  id: number;
  email: string;
  roles: string[];
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log("Fetching to ", endpoints.auth.login);

  const response = await fetch(endpoints.auth.login, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  console.log("Login response status:", response.status);

  if (response.ok) {
    const data = await response.json();
    // data: { id: number, email: string, token: string }
    const token = data.token;
    const userId = data.id.toString();
    const userEmail = data.email;

    console.log("Login successful, setting cookies", data);

    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: config.isProduction,
    });
    cookieStore.set("user_id", userId, {
      httpOnly: false,
    });
    cookieStore.set("user_email", userEmail, {
      httpOnly: false,
    });

    return { success: true };
  } else {
    return { error: "Invalid email or password" };
  }
}

export async function signup(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Please confirm the fields for SignUpResource. Assuming name, email, password.
  const response = await fetch(endpoints.auth.register, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (response.ok) {
    return { success: true };
  } else {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Registration failed" }));
    return { error: errorData.message || "An unknown error occurred" };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const userId = cookieStore.get("user_id")?.value;

  if (!token || !userId) {
    return null;
  }

  try {
    const response = await fetch(endpoints.users.getById(userId), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      // data: { id: number, email: string, roles: string[] }
      return {
        id: data.id,
        email: data.email,
        roles: data.roles,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  cookieStore.delete("user_id");
  cookieStore.delete("user_email");
  redirect("/login");
}
