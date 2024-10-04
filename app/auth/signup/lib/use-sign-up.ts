import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/service/auth/auth-service";

export const useSignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const { data, status } = await authService.signUp({ username, password });

    if (status === 201) {
      setSuccess(true);
      setTimeout(() => router.push('/auth/signin'), 2000);
    } else {
      setError(data.message);
    }
  };

  const state = {
    username,
    password,
    error,
    success,
  };

  const handle = {
    submit: handleSubmit,
    setUsername,
    setPassword,
  };

  return { state, handle };
};
