import { Metadata } from 'next';
import styles from '../root.module.scss';
import ResetPage from '../../components/resetPage/ResetPage';

export async function generateMetadata() {
  const metadata: Metadata = {
    title: 'Reset password',
    description: 'Reset your password',
    keywords: 'account, email,password',
    alternates: {
      canonical: '/reset-password',
    },
    openGraph: {
      title: 'Reset password',
      description: '',
      url: '/reset-password',
      locale: 'en_US',
      type: 'website',
      
    },
  };
  return metadata;
}

const Reset = () => {
  return (
    <div className={styles.root}>
      <ResetPage />
    </div>
  );
};

export default Reset;
