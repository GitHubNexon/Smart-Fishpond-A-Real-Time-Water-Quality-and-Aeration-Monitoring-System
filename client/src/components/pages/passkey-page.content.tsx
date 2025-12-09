import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PasskeyPageAuth from '../forms/auth-passkey.form';

const PasskeyPageContent = async () => {
  const cookieStore = await cookies();

  const authToken = cookieStore.get('_auth_token_')?.value;
  const passkeyToken = cookieStore.get('_passkey_token_')?.value;

  if (!authToken) {
    redirect('/login');
  }

  if (authToken && passkeyToken) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <PasskeyPageAuth />
    </div>
  );
};

export default PasskeyPageContent;
