'use client';
import React, { useState } from 'react';
import styles from './authorized.module.scss';
import { useRouter } from 'next/navigation';
import { logout } from '../../api/AuthProvider';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { FadeLoader } from 'react-spinners';
import Input from '../input/Input';
import { useFormik } from 'formik';
import { ListFormFields } from '../../interfaces/form.interface';
import { todoSchema } from '../validation/validation';
import TodoList from '../todoList/TodoList';
import TodoInputComponent from '../todoInputComponent/TodoInputComponent';
import { editTodoSchema } from '../validation/todoValidation';
import { editTodoFields } from '../todoFormFunctions/todoFormFields';
import { createNewTodo, editTodo } from '../../api/TodoProvider';
import { useGetInfo } from '../../hooks/useGetInfo';

const AuthorizedPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [isCreateList, setIsCreateList] = useState(false);
    const {
      isLoading,
      currentTodoId,
      isEditTodo,
      username,
      email,
      isAuth,
      todoList
    } = useAppSelector(
      (state) => state);
    const formik = useFormik<ListFormFields>({
      initialValues: {
        listName: '',
      },
      validationSchema: todoSchema,
      onSubmit: async(values) => {
        await dispatch(createNewTodo(values.listName));
        setIsCreateList(false);
      },
    });
    
    const onSubmitEditTodo = async(values: any) => {
      await dispatch(editTodo({...values, id: Number(currentTodoId)}));
    };
    
    useGetInfo();
    
    if (isLoading) {
      return (
        <div className={styles.authorized__wrapper}>
          <div className={styles.authorized}>
            <FadeLoader color={'white'} loading={true} />
          </div>
        </div>
      );
    }
    
    if (!isAuth) {
      return (
        <div className={styles.authorized__wrapper}>
          <div className={styles.authorized}>
            <p className={styles.authorized__text}>Access denied</p>
            <button className={styles.authorized__button} onClick={() => router.push('/auth')}>
              Return to auth page
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <div className={styles.authorized__wrapper}>
        <button className={styles.authorized__button} onClick={async() => await dispatch(logout(router))}>Log out</button>
        <div className={styles.authorized}>
          <p className={styles.authorized__text}>userName: {username}</p>
          <p className={styles.authorized__text}>email: {email}</p>
          <button className={styles.authorized__button} onClick={() => setIsCreateList((prev) => !prev)}>
            Create todo list
          </button>
          <TodoInputComponent
            inputText={'Edit todo'}
            isVisible={isEditTodo}
            validation={editTodoSchema}
            fields={editTodoFields}
            onFormSubmit={onSubmitEditTodo}
          />
          <form onSubmit={formik.handleSubmit} className={!isCreateList ? 'hidden' : 'block mt-10'}>
            <Input
              name='listName'
              placeholder='Todo name'
              type={'text'}
              value={formik.values.listName}
              onChangeFn={formik.handleChange}
              onBlurFn={formik.handleBlur}
              isTouched={formik.touched.listName}
              error={formik.errors.listName}
            />
            <div>
              <button className={styles.authorized__submit} type='submit'>
                Create
              </button>
            </div>
          </form>
        </div>
        {
          todoList.length > 0 ?
            <TodoList />
            : null
        }
      </div>
    );
  }
;

export default AuthorizedPage;