import { Metadata } from 'next';
import { AuthPage } from '../../components';
import styles from '../root.module.scss';
import { redirect } from 'next/navigation';
import { getToken } from '../../api/cookiesOperation';

export async function generateMetadata() {
  const metadata: Metadata = {
    title: 'Signin',
    description: 'Login into your account',
    keywords: 'sign in, account, email,password',
    alternates: {
      canonical: '/auth',
    },
    openGraph: {
      title: 'Sign in',
      description: '',
      url: '/auth',
      locale: 'en_US',
      type: 'website',
      
    },
  };
  return metadata;
}

const Auth = async () => {
  const token = await getToken();
  if (token) redirect('/');

  return (
    <main className={styles.root}>
      <AuthPage />
    </main>
  );
};

export default Auth;