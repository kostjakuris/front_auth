'use client';
import React, { FC, useState } from 'react';
import styles from '../taskList/task-list.module.scss';
import { setPrevCreateSubTask, setPrevEditTask } from '../../lib/slice';
import { useAppDispatch } from '../../lib/hooks';
import { Create } from '../../../public/images/Create';
import { Edit } from '../../../public/images/Edit';
import { Delete } from '../../../public/images/Delete';
import { useDeleteTaskMutation } from '../../lib/userApi';

interface TaskItemProps {
  id: number;
  name: string;
  status: string;
  description: string;
  subTasks: any[];
}

const TaskItem: FC<TaskItemProps> = ({id, name, status, description, subTasks}) => {
  const dispatch = useAppDispatch();
  const [deleteTask] = useDeleteTaskMutation();
  const correctSubTasks = subTasks?.map(element => element);
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  
  function openQuestion() {
    if (!isOpen) {
      setIsOpen(true);
      requestAnimationFrame(() => setIsActive(true));
    } else {
      setIsActive(false);
      const visibilityTimeout = setTimeout(() => {
        setIsOpen(false);
      }, 300);
      return () => clearTimeout(visibilityTimeout);
    }
  }
  
  return (
    <>
      <div className={styles.task__container}>
        <div className={styles.task__content}>
          <p className={styles.task__title}>{name}</p>
          <p className={styles.task__text}>Status: {status}</p>
          <div className={styles.task__buttons}>
            <button className={'cursor-pointer h-10'} onClick={() => dispatch(setPrevCreateSubTask(id))}>
              <Create />
            </button>
            <button className={'cursor-pointer h-10'}
              onClick={() => dispatch(setPrevEditTask(id))}>
              <Edit />
            </button>
            <button className={'cursor-pointer h-10'}
              onClick={async() => await deleteTask(id)}>
              <Delete />
            </button>
            <button className={styles.task__button} onClick={openQuestion}>
              All tasks
            </button>
          </div>
        </div>
        <p className={`${styles.task__text} text-left w-full px-5 mb-8`}>Description: {description}</p>
      </div>
      {
        correctSubTasks?.length > 0 ?
          correctSubTasks.map((element: any) =>
            <div key={element.id} className={`${styles.task} ${isActive ? styles.task__active : ''}
            ${!isOpen ? styles.task__disabled : ''}`}>
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
    </>
  
  )
    ;
};

export default TaskItem;