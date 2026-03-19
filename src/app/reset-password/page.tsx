import { Metadata } from 'next';
import styles from '../root.module.scss';
import { ResetPage } from '../../components';

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

type ResetPageProps = {
  params: Promise<{token: string;}>
};

const Reset = async(props: ResetPageProps) => {
  const {token} = await props.params;
  return (
    <main className={styles.root}>
      <ResetPage token={token} />
    </main>
  );
};

export default Reset;
