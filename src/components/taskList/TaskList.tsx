'use client';
import React, { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import styles from './task-list.module.scss';
import authStyles from '../../components/authorizedPage/authorized.module.scss';
import { setPrevCreateTask } from '../../lib/slice';
import TodoInputComponent from '../todoInputComponent/TodoInputComponent';
import { createTaskSchema } from '../validation/todoValidation';
import { createTaskFields, editTaskFields } from '../todoFormFunctions/todoFormFields';
import { CreateTaskFields } from '../../interfaces/form.interface';
import TaskItem from '../taskItem/TaskItem';
import { useGetInfo } from '../../hooks/useGetInfo';
import { useRouter } from 'next/navigation';
import { useCreateNewTaskMutation, useEditTaskMutation, useGetAllTasksQuery } from '../../lib/userApi';
import { FadeLoader } from 'react-spinners';

interface TaskListProps {
  id: string;
}

const TaskList: FC<TaskListProps> = ({id}) => {
    const dispatch = useAppDispatch();
    const [taskList, setTaskList] = useState<any[]>([]);
    const {data, isLoading: isGetTaskLoading} = useGetAllTasksQuery(id);
    const [createNewTask, {isLoading: isTaskLoading}] = useCreateNewTaskMutation();
    const [editTask, {isLoading: isEditTaskLoading}] = useEditTaskMutation();
    
    const router = useRouter();
    const {
      isCreateTask,
      currentTaskId,
      isTask,
      isEditTask,
      isAuth
    } = useAppSelector(
      state => state.auth);
    
    const onSubmitCreateTask = async(values: CreateTaskFields) => {
      if (isTask) {
        await createNewTask(
          {...values, todoId: Number(id), parentId: Number(currentTaskId)});
      } else {
        await createNewTask({...values, todoId: Number(id)});
      }
    };
    
    const isLoading = isGetTaskLoading || isTaskLoading || isEditTaskLoading;
    
    const onSubmitEditTask = async(values: any) => {
      const currentTask = taskList.find(task => task.id === currentTaskId)
        || taskList.flatMap(task => task.subTasks || []).find(sub => sub.id === currentTaskId);
      const cleanedValues = {
        name: values.name !== '' ? values.name : currentTask.name,
        description: values.description !== '' ? values.description : currentTask.description,
        status: values.status !== '' ? values.status : currentTask.status,
        id: Number(currentTaskId),
      };
      await editTask({...cleanedValues});
    };
    
    useGetInfo();
    
    useEffect(() => {
      if (data) {
        setTaskList(data);
      }
    }, [data]);
    
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
  }
;

export default TaskList;