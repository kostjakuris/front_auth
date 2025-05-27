import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  email: Yup.string().trim().required('Email is required.').email('Please, enter valid email'),
  password: Yup.string().trim().required('Password is required.'),
});