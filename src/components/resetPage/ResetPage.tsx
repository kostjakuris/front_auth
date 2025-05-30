'use client';
import React, { useEffect, useState } from 'react';
import styles from '../authorization/authorization.module.scss';
import { useFormik } from 'formik';
import Input from '../input/Input';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { getIsAuth } from '../../lib/slice';
import { FadeLoader } from 'react-spinners';
import { resetSchema } from '../validation/validation';
import { ResetFormFields } from '../../interfaces/form.interface';
import { resetPassword } from '../../api/AuthProvider';
import Link from 'next/link';

const ResetPage = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [resetToken, setResetToken] = useState('');
  const {error, isLoading, resetMessage, isAuth} = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const formik = useFormik<ResetFormFields>({
    initialValues: {
      password: '',
    },
    validationSchema: resetSchema,
    onSubmit: async(values) => {
      await dispatch(resetPassword({token: resetToken, password: values.password}));
    },
  });
  
  useEffect(() => {
    const token = params.get('token');
    if (!token) {
      notFound();
    }
    setResetToken(token);
    dispatch(getIsAuth());
    if (isAuth) {
      router.push('/authorized');
    }
  }, []);
  
  if (resetMessage) {
    return (
      <div className={styles.authorization}>
        <p className={styles.authorization__text}>{resetMessage}</p>
        <Link className={styles.authorization__agreement_secondLink} href={'/auth/'}>
          Comeback to auth page
        </Link>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className={styles.authorization}>
        <FadeLoader color={'white'} loading={true} />
      </div>
    );
  }
  return (
    <div className={styles.authorization}>
      <h2 className={styles.authorization__title}>Reset your password</h2>
      <p className={styles.authorization__text}>Please,enter your new password</p>
        <p className={styles.authorization__error}>{error}</p>
      <form onSubmit={formik.handleSubmit} className={styles.form}>
        <Input
          name='password'
          placeholder='Password'
          type={'password'}
          value={formik.values.password}
          onChangeFn={formik.handleChange}
          onBlurFn={formik.handleBlur}
          isTouched={formik.touched.password}
          error={formik.errors.password}
        />
        <div>
          <button className={styles.form__submit} type='submit'>
            Reset password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPage;