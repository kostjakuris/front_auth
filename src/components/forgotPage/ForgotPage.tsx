'use client';
import React, { useEffect } from 'react';
import styles from '../authorization/authorization.module.scss';
import { useFormik } from 'formik';
import Link from 'next/link';
import Input from '../input/Input';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { getIsAuth } from '../../lib/slice';
import { FadeLoader } from 'react-spinners';
import { forgotSchema } from '../validation/validation';
import { ForgotFormFields } from '../../interfaces/form.interface';
import { sendResetLink } from '../../api/AuthProvider';

const ForgotPage = () => {
  const router = useRouter();
  const {error, isLoading, resetMessage, isAuth} = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const formik = useFormik<ForgotFormFields>({
    initialValues: {
      email: '',
    },
    validationSchema: forgotSchema,
    onSubmit: async(values) => {
      await dispatch(sendResetLink(values.email));
    },
  });
  
  useEffect(() => {
    dispatch(getIsAuth());
    if (isAuth) {
      router.push('/authorized');
    }
  }, []);
  
  if (resetMessage) {
    return (
      <div className={styles.authorization}>
        <p className={styles.authorization__text}>{resetMessage}</p>
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