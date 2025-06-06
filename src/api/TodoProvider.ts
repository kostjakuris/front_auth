import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { backendUrl, setAuthHeader } from './AxiosConfig';
import { CreateTaskFields, DeleteTaskFields, EditTaskFields, EditTodoFields } from '../interfaces/form.interface';

export const getAllTodos = createAsyncThunk('getAllTodos', async(_, thunkAPI) => {
  try {
    await setAuthHeader();
    const response = await axios.get(`${backendUrl}/todo/all`, {withCredentials: true});
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const getAllTasks = createAsyncThunk('getAllTasks', async(name: string, thunkAPI) => {
  try {
    await setAuthHeader();
    const response = await axios.post(`${backendUrl}/task/all`, {name}, {withCredentials: true});
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const createNewTodo = createAsyncThunk('createNewTodo', async(name: string, thunkAPI) => {
  try {
    await setAuthHeader();
    const response = await axios.post(`${backendUrl}/todo/create`, {
      name
    }, {withCredentials: true});
    await thunkAPI.dispatch(getAllTodos());
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const createNewTask = createAsyncThunk('createNewTask',
  async({name, todoName, description, todoId, parentId}: CreateTaskFields, thunkAPI) => {
    try {
      await setAuthHeader();
      const response = await axios.post(`${backendUrl}/task/create`, {
        todoId, name, description, parentId, todoName
      }, {withCredentials: true});
      await thunkAPI.dispatch(getAllTasks(todoName));
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteTodo = createAsyncThunk('deleteTodo',
  async(id: number, thunkAPI) => {
    try {
      await setAuthHeader();
      const response = await axios.delete(`${backendUrl}/todo/delete`, {
        data: {id}
      });
      await thunkAPI.dispatch(getAllTodos());
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const editTodo = createAsyncThunk('editTodo',
  async({id, name}: EditTodoFields, thunkAPI) => {
    try {
      await setAuthHeader();
      const response = await axios.patch(`${backendUrl}/todo/edit`, {
        id, name
      });
      await thunkAPI.dispatch(getAllTodos());
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const editTask = createAsyncThunk('editTask',
  async({id, name, description, status, todoName}: EditTaskFields, thunkAPI) => {
    try {
      await setAuthHeader();
      const response = await axios.patch(`${backendUrl}/task/edit`, {
        id, name, description, status
      });
      await thunkAPI.dispatch(getAllTasks(todoName));
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteTask = createAsyncThunk('deleteTask',
  async({id, todoName}: DeleteTaskFields, thunkAPI) => {
    try {
      await setAuthHeader();
      const response = await axios.delete(`${backendUrl}/task/delete`, {
        data: {id}
      });
      await thunkAPI.dispatch(getAllTasks(todoName));
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);