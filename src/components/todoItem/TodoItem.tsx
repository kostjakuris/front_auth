import React, { FC } from 'react';
import styles from './todo-item.module.scss';
import { setPrevEditTodo } from '../../lib/slice';
import { useAppDispatch } from '../../lib/hooks';
import { deleteTodo } from '../../api/TodoProvider';
import Link from 'next/link';
import { Edit } from '../../../public/images/Edit';
import { Delete } from '../../../public/images/Delete';

interface TodoItemProps {
  todoId: number;
  todoName: string;
}

const TodoItem: FC<TodoItemProps> = ({todoId, todoName}) => {
  const dispatch = useAppDispatch();
  
  return (
    <div className={styles.todo}>
      <div className={styles.todo__wrapper}>
        <div className={styles.todo__content}>
          <p className={styles.todo__title}>{todoName}</p>
          <div className={styles.todo__buttons}>
            <button className={'cursor-pointer h-10'} onClick={() => dispatch(setPrevEditTodo(todoId))}>
              <Edit />
            </button>
            <button className={'cursor-pointer h-10'} onClick={async() => await dispatch(deleteTodo(todoId))}>
              <Delete />
            </button>
            <Link href={`/authorized/todo/${todoId}`} className={`${styles.todo__button} text-center pt-1`}>
              All tasks
            </Link>
          </div>
        </div>
      </div>
    </div>
  
  );
};

export default TodoItem;