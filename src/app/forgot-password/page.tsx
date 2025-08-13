import { Metadata } from 'next';
import styles from '../root.module.scss';
import { ForgotPage } from '../../components';

export async function generateMetadata() {
  const metadata: Metadata = {
    title: 'Forgot password',
    description: 'Reset your password',
    keywords: 'account, email, password',
    alternates: {
      canonical: '/forgot-password',
    },
    openGraph: {
      title: 'Forgot password',
      description: '',
      url: '/forgot-password',
      locale: 'en_US',
      type: 'website',
      
    },
  };
  return metadata;
}

const Forgot = () => {
  return (
    <div className={styles.root}>
      <ForgotPage />
    </div>
  );
};

export default Forgot;