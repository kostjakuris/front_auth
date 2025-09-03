'use client';
import React, { useEffect } from 'react';
import styles from '../../authorization/authorization.module.scss';
import { useFormik } from 'formik';
import Link from 'next/link';
import { Input } from '../input';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../../lib/hooks';
import { getIsAuth } from '../../../lib/slice';
import { FadeLoader } from 'react-spinners';
import { forgotSchema } from '../../validation/validation';
import { ForgotFormFields } from '../../../interfaces/form.interface';
import { useSendResetLinkMutation } from '../../../lib/authApi';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

const ForgotPage = () => {
  const router = useRouter();
  const {isAuth} = useAppSelector((state) => state.auth);
  const [sendResetLink, {data, isLoading, error}] = useSendResetLinkMutation();
  const forgotError = error as FetchBaseQueryError & {data: {message: string; code: string}};
  
  const dispatch = useAppDispatch();
  const formik = useFormik<ForgotFormFields>({
    initialValues: {
      email: '',
    },
    validationSchema: forgotSchema,
    onSubmit: async(values) => {
      await sendResetLink(values.email);
    },
  });
  
  useEffect(() => {
    dispatch(getIsAuth());
    if (isAuth) {
      router.push('/authorized');
    }
  }, []);
  
  if (data) {
    return (
      <div className={styles.authorization}>
        <p className={styles.authorization__text}>{data}</p>
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
      <p className={styles.authorization__text}>Please,enter your email to reset your password!</p>
      <p className={styles.authorization__error}>{forgotError?.data.message}</p>
      <form onSubmit={formik.handleSubmit} className={styles.form}>
        <Input
          name='email'
          placeholder='Email'
          type={'email'}
          value={formik.values.email}
          onChangeFn={formik.handleChange}
          onBlurFn={formik.handleBlur}
          isTouched={formik.touched.email}
          error={formik.errors.email}
        />
        <div>
          <button className={styles.form__submit} type='submit'>
            Send email
          </button>
        </div>
      </form>
      <p className={styles.authorization__link}>Remember your password?
        <Link className={styles.authorization__agreement_secondLink} href={'/auth/'}>
          Comeback to auth page
        </Link>
      </p>
    </div>
  );
};

export default ForgotPage;