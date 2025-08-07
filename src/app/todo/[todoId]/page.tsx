import React from 'react';
import TaskList from '../../../../components/taskList/TaskList';

const TodoPage = async({params}: {params: {todoId: string}}) => {
  const {todoId} = await params;
  return (
    <TaskList id={todoId} />
  );
};

export default TodoPage;