import React from 'react';
import TaskList from '../../../../components/taskList/TaskList';

const TodoPage = async({params}: {params: {todoId: string}}) => {
  return (
    <TaskList id={params.todoId} />
  );
};

export default TodoPage;