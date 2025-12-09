// app/(public)/login/page.tsx
import LoginPageContent from '@/components/pages/login-page.content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | RVTM AMS',
  description: 'Sign in to access the RVTM AMS system',
};

export default async function LoginPage() {
  return <LoginPageContent />;
}
