import React from 'react';
import TaskList from '../../../../components/taskList/TaskList';

const TodoPage = async({params}: {params: {todoName: string}}) => {
  return (
    <TaskList name={params.todoName} />
  );
};

export default TodoPage;