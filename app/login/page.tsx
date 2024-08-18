import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { LoginForm, authFormSchema } from '@/components/LoginForm';
import { z } from 'zod';
import Link from 'next/link';

export default function Login() {
  const signIn = async (values: z.infer<typeof authFormSchema>) => {
    'use server';
    console.log('login', values);
    const email = values.email;
    const password = values.password;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log('login error', error);
      return redirect('/login?message=Could not authenticate user');
    }

    return redirect('/dashboard');
  };

  return (
    <div className="flex-1 flex flex-col w-[100vw] h-[100vh] px-8 sm:max-w-md justify-center gap-2 items-center">
      <LoginForm onSubmit={signIn} />
      <Link className="text-sm text-muted-foreground" href="/sign-up">
        No account? Sign up
      </Link>
    </div>
  );
}
