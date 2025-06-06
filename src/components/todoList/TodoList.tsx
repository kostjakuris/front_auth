import React from 'react';
import styles from './todo-list.module.scss';
import TodoItem from '../todoItem/TodoItem';
import { useAppSelector } from '../../lib/hooks';

const TodoList = () => {
  const {todoList} = useAppSelector(state => state);
  return (
    <div className={styles.todos}>
      <h2 className={styles.todos__header}>Todos</h2>
      {
        todoList.map((element) => <TodoItem key={element.id} todoId={element.id} todoName={element.name} />)
      }
    </div>
  );
};

export default TodoList;