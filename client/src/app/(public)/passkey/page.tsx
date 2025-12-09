import LoginPageContent from '@/components/pages/login-page.content';
import PasskeyPageContent from '@/components/pages/passkey-page.content'
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '2 Factor Authentication | RVTM AMS',
  description: 'Input Passkey to access the RVTM AMS system',
};

export default async function PasskeyPage() {
  return <PasskeyPageContent />;
}
