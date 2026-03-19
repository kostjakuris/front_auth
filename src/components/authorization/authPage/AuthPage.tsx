'use client';
import React, { useEffect } from 'react';
import styles from '../authorization.module.scss';
import { useFormik } from 'formik';
import Link from 'next/link';
import { authSchema } from '../../validation/validation';
import { LoginFormFields } from '../../../interfaces/form.interface';
import { Input } from '../../ui/input';
import { FadeLoader } from 'react-spinners';
import { useLoginMutation } from '../../../lib/userApi';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useAppDispatch, useAppSelector } from '../../../lib/hooks';
import { setIsAuthLoading } from '../../../lib/slice';
import Google from '../../../../public/images/Google';
import { useRouterChange } from '../../../hooks/useRouterChange';


const AuthPage = () => {
  const [loginFn, {isLoading: isLoginLoading, error, isSuccess}] = useLoginMutation();
  const authError = error as FetchBaseQueryError & {data: {message: string; code: string}};
  const {isAuthLoading} = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const isLoading = isLoginLoading || isAuthLoading;
  
  const formik = useFormik<LoginFormFields>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: authSchema,
    onSubmit: async(values: LoginFormFields) => {
      try {
        dispatch(setIsAuthLoading(true));
        await loginFn(values);
      } catch (e) {
        dispatch(setIsAuthLoading(false));
      }
    },
  });
  
  const startGoogleAuth = () => {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_CALLBACK_URL!,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
    });
    
    window.location.href =
      `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  };
  
  useRouterChange(isSuccess);
  
  // useEffect(() => {
  //   if (isAuthLoading) {
  //     dispatch(setIsAuthLoading(false));
  //   }
  // }, []);
  
  if (isLoading) {
    return (
      <div className={styles.authorization}>
        <FadeLoader color={'white'} loading={true} />
      </div>
    );
  }
  return (
    <section className={styles.authorization}>
      <h2 className={styles.authorization__title}>Sign In</h2>
      <p className={styles.authorization__text}>Please,enter your email and password!</p>
      <p className={styles.authorization__error}>{authError?.data.message}</p>
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
      <button className={styles.form__google_auth} onClick={startGoogleAuth}>
        <Google />
        Sign in with Google
      </button>
      <p className={styles.authorization__link}>Don’t have an account?
        <Link className={styles.authorization__agreement_secondLink} href={'/register/'}>
          Create one
        </Link>
      </p>
      {/*<Link className={styles.authorization__repassword_link} href={'/forgot-password/'}>*/}
      {/*  Forgot your password?*/}
      {/*</Link>*/}
    </section>
  );
};

export default AuthPage;