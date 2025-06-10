'use client';
import React, { useEffect, useState } from 'react';
import styles from './authorized.module.scss';
import { useRouter } from 'next/navigation';
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
import { useGetInfo } from '../../hooks/useGetInfo';
import { useLazyLogoutQuery } from '../../lib/authApi';
import { getIsAuth } from '../../lib/slice';
import { useCreateNewTodoMutation, useEditTodoMutation, useGetUserInfoQuery } from '../../lib/userApi';

const AuthorizedPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [createNewTodo, {
      isLoading: isCreateTodoLoading,
    }] = useCreateNewTodoMutation();
    
    const [editTodo, {isLoading: isEditTodoLoading}] = useEditTodoMutation();
    const [email, setEmail] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    
    const [isCreateList, setIsCreateList] = useState(false);
    const {
      currentTodoId,
      isEditTodo,
      isAuth,
    } = useAppSelector(
      (state) => state.auth);
    
    const [logout, {isLoading: isLogoutLoading}] = useLazyLogoutQuery();
    const {data: userData, isLoading: isUserInfoLoading} = useGetUserInfoQuery('');
    const isLoading = isLogoutLoading || isUserInfoLoading || isCreateTodoLoading ||
      isEditTodoLoading;
    
    const formik = useFormik<ListFormFields>({
      initialValues: {
        listName: '',
      },
      validationSchema: todoSchema,
      onSubmit: async(values) => {
        await createNewTodo(values.listName);
        setIsCreateList(false);
      },
    });
    
    const onSubmitEditTodo = async(values: any) => {
      await editTodo({...values, id: Number(currentTodoId)});
    };
    
    useGetInfo();
    
    useEffect(() => {
      if (userData) {
        setEmail(userData.email);
        setUserName(userData.username);
      }
    }, [userData]);
    
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
    
    const logoutFn = async() => {
      await logout('');
      localStorage.setItem('isAuth', 'false');
      dispatch(getIsAuth());
      router.push('/auth');
    };
    
    return (
      <div className={styles.authorized__wrapper}>
        <button className={styles.authorized__button} onClick={logoutFn}>Log out</button>
        <div className={styles.authorized}>
          <p className={styles.authorized__text}>userName: {userName}</p>
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
        <TodoList />
      </div>
    );
  }
;

export default AuthorizedPage;