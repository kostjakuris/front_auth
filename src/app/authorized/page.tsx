import { Metadata } from 'next';
import styles from '../root.module.scss';
import AuthorizedPage from '../../components/authorizedPage/AuthorizedPage';

export async function generateMetadata() {
  const metadata: Metadata = {
    title: 'Authorized page',
    description: 'User authorized page',
    keywords: 'authorized, account, email,password',
    alternates: {
      canonical: '/authorized',
    },
    openGraph: {
      title: 'Authorized',
      description: '',
      url: '/authorized',
      locale: 'en_US',
      type: 'website',
      
    },
  };
  return metadata;
}

const Authorized = () => {
  return (
    <div className={styles.root}>
      <AuthorizedPage />
    </div>
  );
};

export default Authorized;