'use client';
import React, { useEffect } from 'react';
import styles from '../authorization.module.scss';
import { useFormik } from 'formik';
import Link from 'next/link';
import { authSchema } from '../../validation/validation';
import { LoginFormFields } from '../../../interfaces/form.interface';
import Input from '../../input/Input';
import { login } from '../../../api/AuthProvider';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../../lib/hooks';
import { getIsAuth } from '../../../lib/slice';
import { FadeLoader } from 'react-spinners';

const AuthPage = () => {
  const router = useRouter();
  const {error, isLoading, isAuth} = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const formik = useFormik<LoginFormFields>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: authSchema,
    onSubmit: async(values: LoginFormFields) => {
      const response = await dispatch(login({...values}));
      if (response.payload.access_token) {
        router.push('/authorized');
      }
    },
  });
  
  useEffect(() => {
    dispatch(getIsAuth());
    if (isAuth) {
      router.push('/authorized');
    }
  }, []);
  
  if (isLoading) {
    return (
      <div className={styles.authorization}>
        <FadeLoader color={'white'} loading={true} />
      </div>
    );
  }
  return (
    <div className={styles.authorization}>
      <h2 className={styles.authorization__title}>Sign In</h2>
      <p className={styles.authorization__text}>Please,enter your email and password!</p>
      <p className={styles.authorization__error}>{error}</p>
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
            Sign In
          </button>
        </div>
      </form>
      <p className={styles.authorization__link}>Don’t have an account?
        <Link className={styles.authorization__agreement_secondLink} href={'/register/'}>
          Create one
        </Link>
      </p>
      <Link className={styles.authorization__repassword_link} href={'/forgot-password/'}>
        Forgot your password?
      </Link>
    </div>
  );
};

export default AuthPage;