'use client';
import React from 'react';
import styles from '../authorization.module.scss';
import { useFormik } from 'formik';
import Link from 'next/link';
import { authSchema } from '../../validation/validation';
import { LoginFormFields } from '../../../interfaces/form.interface';
import { Input } from '../../ui/input';
import { FadeLoader } from 'react-spinners';
import { useLoginMutation } from '../../../lib/userApi';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useRouterChange } from '../../../hooks/useRouterChange';


const AuthPage = () => {
  const [loginFn, {isLoading, error, isSuccess}] = useLoginMutation();
  const authError = error as FetchBaseQueryError & {data: {message: string; code: string}};
  const formik = useFormik<LoginFormFields>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: authSchema,
    onSubmit: async(values: LoginFormFields) => {
      await loginFn({...values});
    },
  });
  
  useRouterChange(isSuccess);
  
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