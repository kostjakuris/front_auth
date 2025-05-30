'use client';
import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import styles from '../authorization.module.scss';
import Link from 'next/link';
import { registrationSchema } from '../../validation/validation';
import { RegisterFormFields } from '../../../interfaces/form.interface';
import Input from '../../input/Input';
import { register } from '../../../api/AuthProvider';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../../lib/hooks';
import { getIsAuth } from '../../../lib/slice';
import { FadeLoader } from 'react-spinners';


const RegisterPage = () => {
  const router = useRouter();
  const {error, isLoading, isAuth} = useAppSelector(state => state);
  const dispatch = useAppDispatch();
  const formik = useFormik<RegisterFormFields>({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    validationSchema: registrationSchema,
    onSubmit: async(values: RegisterFormFields) => {
      const response = await dispatch(register({...values}));
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
      <h2 className={styles.authorization__title}>Sign Up</h2>
      <p className={styles.authorization__text}>Please,enter your future profile data</p>
      <p className={styles.authorization__error}>{error}</p>
      <form onSubmit={formik.handleSubmit} className={styles.form}>
        <Input
          name='username'
          placeholder='Username'
          type={'text'}
          value={formik.values.username}
          onChangeFn={formik.handleChange}
          onBlurFn={formik.handleBlur}
          isTouched={formik.touched.username}
          error={formik.errors.username}
        />
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
            Sign Up
          </button>
        </div>
      </form>
      <p className={styles.authorization__link}>Already have an account?
        <Link className={styles.authorization__agreement_secondLink} href={'/auth/'}>
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;