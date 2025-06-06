'use client';
import React, { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { createNewTask, editTask, getAllTasks } from '../../api/TodoProvider';
import styles from './task-list.module.scss';
import authStyles from '../../components/authorizedPage/authorized.module.scss';
import { setCurrentTodoName, setPrevCreateTask } from '../../lib/slice';
import { FadeLoader } from 'react-spinners';
import TodoInputComponent from '../todoInputComponent/TodoInputComponent';
import { createTaskSchema } from '../validation/todoValidation';
import { createTaskFields, editTaskFields } from '../todoFormFunctions/todoFormFields';
import { CreateTaskFields } from '../../interfaces/form.interface';
import TaskItem from '../taskItem/TaskItem';
import { useGetInfo } from '../../hooks/useGetInfo';
import { useRouter } from 'next/navigation';

interface TaskListProps {
  name: string;
}

const TaskList: FC<TaskListProps> = ({name}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const correctName = name.replaceAll('-', ' ').trim();
  const {taskList, isLoading, isCreateTask, currentTaskId, isTask, isEditTask, isAuth} = useAppSelector(
    state => state);
  
  const onSubmitCreateTask = async(values: CreateTaskFields) => {
    if (isTask) {
      await dispatch(createNewTask(
        {...values, todoName: correctName, parentId: Number(currentTaskId)}));
    } else {
      await dispatch(createNewTask({...values, todoName: correctName}));
    }
  };
  
  const onSubmitEditTask = async(values: any) => {
    const currentTask = taskList.find((element: {id: number | null;}) => element.id === currentTaskId);
    const cleanedValues = {
      name: values.name !== '' ? values.name : currentTask.name,
      description: values.description !== '' ? values.description : currentTask.description,
      status: values.status !== '' ? values.status : currentTask.status,
      id: Number(currentTaskId),
    };
    await dispatch(editTask({...cleanedValues, todoName: correctName}));
  };
  
  const getAllTasksByName = async() => {
    await dispatch(getAllTasks(correctName));
  };
  
  useGetInfo();
  
  
  useEffect(() => {
    dispatch(setCurrentTodoName(correctName));
    getAllTasksByName();
  }, []);
  
  if (isLoading) {
    return (
      <div className={'flex flex-col items-center justify-center h-150'}>
        <FadeLoader color={'white'} loading={true} />
      </div>
    );
  }
  
  if (!isAuth) {
    return (
      <div className={authStyles.authorized__wrapper}>
        <div className={authStyles.authorized}>
          <p className={authStyles.authorized__text}>Access denied</p>
          <button className={authStyles.authorized__button} onClick={() => router.push('/auth')}>
            Return to auth page
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={'flex flex-col items-center justify-center'}>
      <button className={`${styles.task__button} mt-10`} onClick={() => dispatch(setPrevCreateTask())}>
        Create new task
      </button>
      <TodoInputComponent
        inputText={'Create new task'}
        isVisible={isCreateTask}
        validation={createTaskSchema}
        fields={createTaskFields}
        onFormSubmit={onSubmitCreateTask}
      />
      <TodoInputComponent
        inputText={'Edit task'}
        isVisible={isEditTask}
        fields={editTaskFields}
        onFormSubmit={onSubmitEditTask}
      />
      {
        taskList ?
          taskList.map((element) =>
            <div key={element.id} className={styles.task__borders}>
              <TaskItem
                id={element.id}
                name={element.name}
                status={element.status}
                description={element.description}
                subTasks={element.subTasks}
              />
            </div>
          )
          : null
      }
    </div>
  );
};

export default TaskList;