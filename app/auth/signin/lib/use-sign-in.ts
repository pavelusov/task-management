import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/service/auth/auth-service";

export const useSignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const { data } = await authService.signIn({ username, password });

    if (data.success) {
      router.push('/'); // Переход на страницу задач
    } else {
      setError('Invalid username or password');
    }
  };

  const state = {
    username,
    password,
    error,
  };

  const handle = {
    submit: handleSubmit,
    setUsername,
    setPassword,
  };

  return { state, handle };
};
