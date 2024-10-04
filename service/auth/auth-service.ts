import { SignParams } from "@/types/auth";
import { signIn } from "next-auth/react";

export const authService = {
  signIn: async ({ username, password }: SignParams) => {
    const result = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    return {
      data: { success:  result?.ok },
    }
  },
  signUp: async ({ username, password }: SignParams) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    return { data: await res.json(), status: res.status };
  },
}