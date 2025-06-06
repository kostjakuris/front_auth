import * as Yup from 'yup';

export const authSchema = Yup.object().shape({
  email: Yup.string().trim().required('Email is required.').email('Please, enter valid email'),
  password: Yup.string().trim().required('Password is required.'),
});

export const todoSchema = Yup.object().shape({
  listName: Yup.string().trim().required('Todo name is required.'),
});

export const forgotSchema = Yup.object().shape({
  email: Yup.string().trim().required('Email is required.').email('Please, enter valid email'),
});

export const resetSchema = Yup.object().shape({
  password: Yup.string().trim().required('Password is required.'),
});

export const registrationSchema = Yup.object().shape({
  username: Yup.string().trim().required('Username is required.'),
  email: Yup.string().trim().required('Email is required.').email('Please, enter valid email'),
  password: Yup.string().trim().required('Password is required.'),
});