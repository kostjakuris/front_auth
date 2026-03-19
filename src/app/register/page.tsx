import { Metadata } from 'next';
import styles from '../root.module.scss';
import { RegisterPage } from '../../components';
import { redirect } from 'next/navigation';
import { getToken } from '../../api/cookiesOperation';

export async function generateMetadata() {
  const metadata: Metadata = {
    title: 'Sign up',
    description: 'Create your account',
    keywords: 'sign up, account, email,password',
    alternates: {
      canonical: '/register',
    },
    openGraph: {
      title: 'Sign up',
      description: '',
      url: '/register',
      locale: 'en_US',
      type: 'website',
      
    },
    
  };
  return metadata;
}

const Register = async () => {
  const token = await getToken();
  if (token) redirect('/');

  return (
    <main className={styles.root}>
      <RegisterPage />
    </main>
  );
};

export default Register;