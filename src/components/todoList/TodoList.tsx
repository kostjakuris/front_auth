import React from 'react';
import styles from './todo-list.module.scss';
import TodoItem from '../todoItem/TodoItem';
import { useGetAllTodosQuery } from '../../lib/userApi';

type TodoList = {
  id: number;
  name: string;
}

const TodoList = () => {
  const {data} = useGetAllTodosQuery('');
  
  if (data?.length > 0) {
    return (
      <div className={styles.todos}>
        <h2 className={styles.todos__header}>Todos</h2>
        {
          data?.map((element: TodoList) => <TodoItem key={element.id} todoId={element.id} todoName={element.name} />)
        }
      </div>
    );
  }
  return null;
};

export default TodoList;