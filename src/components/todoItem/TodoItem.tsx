import React, { FC } from 'react';
import styles from './todo-item.module.scss';
import Image from 'next/image';
import { setPrevEditTodo } from '../../lib/slice';
import { useAppDispatch } from '../../lib/hooks';
import { deleteTodo } from '../../api/TodoProvider';
import Link from 'next/link';

interface TodoItemProps {
  todoId: number;
  todoName: string;
}

const TodoItem: FC<TodoItemProps> = ({todoId, todoName}) => {
  const dispatch = useAppDispatch();
  const todoParameter = todoName.replaceAll(' ', '-').trim();
  
  return (
    <div className={styles.todo}>
      <div className={styles.todo__wrapper}>
        <div className={styles.todo__content}>
          <p className={styles.todo__title}>{todoName}</p>
          <div className={styles.todo__buttons}>
            <button className={'cursor-pointer h-10 pt-1.5'} onClick={() => dispatch(setPrevEditTodo(todoId))}>
              <Image src={'/images/edit.svg'} alt={'edit'} width={28} height={28} />
            </button>
            <button className={'cursor-pointer h-10'} onClick={async() => await dispatch(deleteTodo(todoId))}>
              <Image src={'/images/delete.svg'} alt={'delete'} width={30} height={30} />
            </button>
            <Link href={`/authorized/todo/${todoParameter}`} className={`${styles.todo__button} text-center pt-1`}>
              All tasks
            </Link>
          </div>
        </div>
      </div>
    </div>
  
  );
};

export default TodoItem;