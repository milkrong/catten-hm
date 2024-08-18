import { SignUpForm, SignUpFormData } from '@/components/SignUpForm';
import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function SignUpPage() {
  const signUp = async (formData: SignUpFormData) => {
    'use server';

    const origin = headers().get('origin');
    const email = formData.email;
    const password = formData.password;
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('sign up error', error);
      return redirect('/login?message=Could not authenticate user');
    }

    return redirect('/login?message=Check email to continue sign in process');
  };
  return (
    <div className="flex-1 flex flex-col w-[100vw] h-[100vh] px-8 sm:max-w-md justify-center gap-2 items-center">
      <SignUpForm onSubmit={signUp} />
      <Link className="text-sm text-muted-foreground" href="/login">
        Already have an account? Login
      </Link>
    </div>
  );
}
