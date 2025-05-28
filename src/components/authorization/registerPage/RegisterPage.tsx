'use client';
import React from 'react';
import { useFormik } from 'formik';
import styles from '../authorization.module.scss';
import Link from 'next/link';
import { validationSchema } from '../../validation/validation';
import { FormFields } from '../../../folder/form.interface';
import Input from '../../input/Input';
import { register } from '../../../api/AuthProvider';


const RegisterPage = () => {
  const formik = useFormik<FormFields>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async(values: FormFields) => {
      await register({...values});
    },
  });
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const trimmedEmail = e.target.value.trim();
    formik.setFieldValue('email', trimmedEmail);
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const trimmedPassword = e.target.value.trim();
    formik.setFieldValue('password', trimmedPassword);
  };
  
  
  return (
    <div className={styles.authorization}>
      <h2 className={styles.authorization__title}>Sign Up</h2>
      <p className={styles.authorization__text}>Please,enter your future profile data</p>
      <form onSubmit={formik.handleSubmit} className={styles.form}>
        <Input
          name='email'
          placeholder='Email'
          type={'email'}
          value={formik.values.email}
          onChangeFn={handleEmailChange}
          onBlurFn={formik.handleBlur}
          isTouched={formik.touched.email}
          error={formik.errors.email}
        />
        <Input
          name='password'
          placeholder='Password'
          type={'password'}
          value={formik.values.password}
          onChangeFn={handlePasswordChange}
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