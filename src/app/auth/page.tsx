import { Metadata } from 'next';
import { AuthPage } from '../../components';
import styles from '../root.module.scss';

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

const Auth = () => {
  return (
    <div className={styles.root}>
      <AuthPage />
    </div>
  );
};

export default Auth;