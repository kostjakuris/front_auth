import { Metadata } from 'next';
import styles from './register.module.scss';
import RegisterPage from '../../components/authorization/registerPage/RegisterPage';

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
      url: '/login',
      locale: 'en_US',
      type: 'website',
      
    },
  };
  return metadata;
}

const Register = () => {
  return (
    <div className={styles.root}>
      <RegisterPage />
    </div>
  );
};

export default Register;