import * as Yup from 'yup';

export const createTaskSchema = Yup.object().shape({
  name: Yup.string().trim().required('Name is required.'),
  description: Yup.string().trim().required('Description is required.'),
});

export const editTodoSchema = Yup.object().shape({
  name: Yup.string().trim().required('Name is required.'),
});