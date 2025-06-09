import { createSlice } from '@reduxjs/toolkit';
import { getUserInfo, login, logout, register, resetPassword, sendResetLink } from '../api/AuthProvider';
import { createNewTask, createNewTodo, editTask, editTodo, getAllTasks, getAllTodos } from '../api/TodoProvider';

type TodoList = {
  id: number;
  name: string;
}

export interface AppState {
  isAuth: boolean;
  isLoading: boolean;
  isTask: boolean;
  isCreateTask: boolean;
  isEditTask: boolean;
  isEditTodo: boolean;
  todoList: TodoList[];
  taskList: any[];
  currentTodoId: number | null;
  currentTaskId: number | null;
  currentTodoName: string | null;
  username: string | null;
  email: string | null;
  resetMessage: string | null;
  error: string | null;
}

const initialState: AppState = {
  isAuth: false,
  isLoading: false,
  isTask: false,
  isCreateTask: false,
  isEditTask: false,
  isEditTodo: false,
  todoList: [],
  taskList: [],
  currentTodoId: null,
  currentTaskId: null,
  currentTodoName: null,
  username: null,
  email: null,
  resetMessage: null,
  error: null,
};

const appSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    getIsAuth: (state) => {
      const isUserAuthorized = localStorage.getItem('isAuth');
      if (isUserAuthorized === 'true') {
        state.isAuth = true;
      }
    },
    closeTodoForm: (state) => {
      state.isCreateTask = false;
      state.isTask = false;
      state.isEditTask = false;
      state.isEditTodo = false;
    },
    setPrevCreateTask: (state) => {
      if (!state.isCreateTask) {
        state.isCreateTask = !state.isCreateTask;
      }
      state.isTask = false;
      state.isEditTask = false;
      state.isEditTodo = false;
      window.scrollTo(0, 0);
    },
    setPrevCreateSubTask: (state, action) => {
      state.currentTaskId = action.payload;
      if (!state.isCreateTask) {
        state.isCreateTask = !state.isCreateTask;
      }
      if (!state.isTask) {
        state.isTask = !state.isTask;
      }
      state.isEditTask = false;
      state.isEditTodo = false;
      window.scrollTo(0, 0);
    },
    setPrevEditTask: (state, action) => {
      if (!state.isEditTask) {
        state.isEditTask = !state.isCreateTask;
      }
      state.isEditTodo = false;
      state.isCreateTask = false;
      state.currentTaskId = action.payload;
      window.scrollTo(0, 0);
    },
    setPrevEditTodo: (state, action) => {
      if (!state.isEditTodo) {
        state.isEditTodo = !state.isEditTodo;
      }
      state.isCreateTask = false;
      state.isEditTask = false;
      state.currentTodoId = action.payload;
      window.scrollTo(0, 0);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getUserInfo.pending, (state) => {
      state.isLoading = true;
    });
    
    builder.addCase(getUserInfo.fulfilled, (state, action) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.isLoading = false;
    });
    
    builder.addCase(getUserInfo.rejected, (state, action: any) => {
      state.error = action.payload.name as string;
      state.isLoading = false;
    });
    
    builder.addCase(getAllTodos.pending, (state) => {
      state.isLoading = true;
    });
    
    builder.addCase(getAllTodos.fulfilled, (state, action) => {
      state.todoList = action.payload;
      state.isLoading = false;
    });
    
    builder.addCase(getAllTodos.rejected, (state, action: any) => {
      state.error = action.payload.name as string;
      state.isLoading = false;
    });
    
    builder.addCase(getAllTasks.pending, (state) => {
      state.isLoading = true;
    });
    
    builder.addCase(getAllTasks.fulfilled, (state, action) => {
      state.taskList = action.payload;
      state.isLoading = false;
    });
    
    builder.addCase(getAllTasks.rejected, (state, action: any) => {
      state.error = action.payload.name as string;
      state.isLoading = false;
    });
    
    builder.addCase(sendResetLink.pending, (state) => {
      state.isLoading = true;
    });
    
    builder.addCase(sendResetLink.fulfilled, (state, action: any) => {
      state.isLoading = false;
      state.resetMessage = action.payload;
    });
    
    builder.addCase(sendResetLink.rejected, (state, action: any) => {
      state.isLoading = false;
      state.error = action.payload.message as string;
    });
    
    builder.addCase(resetPassword.pending, (state) => {
      state.isLoading = true;
    });
    
    builder.addCase(resetPassword.fulfilled, (state, action: any) => {
      state.isLoading = false;
      state.resetMessage = action.payload;
    });
    
    builder.addCase(resetPassword.rejected, (state, action: any) => {
      state.isLoading = false;
      state.error = action.payload.message as string;
    });
    
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
    });
    
    builder.addCase(login.fulfilled, (state) => {
      state.isAuth = true;
      localStorage.setItem('isAuth', String(state.isAuth));
      state.isLoading = false;
    });
    
    builder.addCase(login.rejected, (state, action: any) => {
      state.error = action.payload.message as string;
      state.isLoading = false;
    });
    
    builder.addCase(logout.pending, (state) => {
      state.isLoading = true;
    });
    
    builder.addCase(logout.fulfilled, (state) => {
      state.isAuth = false;
      state.isLoading = false;
      localStorage.setItem('isAuth', 'false');
    });
    
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
    });
    
    builder.addCase(register.fulfilled, (state) => {
      state.isAuth = true;
      state.isLoading = false;
      localStorage.setItem('isAuth', String(state.isAuth));
    });
    
    builder.addCase(register.rejected, (state, action: any) => {
      state.error = action.payload.message as string;
      state.isLoading = false;
    });
    builder.addCase(createNewTodo.pending, (state) => {
      state.isLoading = true;
    });
    
    builder.addCase(createNewTodo.fulfilled, (state) => {
      state.isLoading = false;
    });
    
    builder.addCase(createNewTodo.rejected, (state, action: any) => {
      state.error = action.payload.message as string;
      state.isLoading = false;
    });
    builder.addCase(editTodo.pending, (state) => {
      state.isLoading = true;
    });
    
    builder.addCase(editTodo.fulfilled, (state) => {
      state.isLoading = false;
      state.isEditTodo = false;
    });
    builder.addCase(editTodo.rejected, (state, action: any) => {
      state.error = action.payload.message as string;
      state.isLoading = false;
    });
    builder.addCase(createNewTask.pending, (state) => {
      state.isLoading = true;
    });
    
    builder.addCase(createNewTask.fulfilled, (state) => {
      state.isLoading = false;
      state.isCreateTask = false;
      state.isTask = false;
    });
    
    builder.addCase(editTask.fulfilled, (state) => {
      state.isLoading = false;
      state.isEditTask = false;
    });
    
    builder.addCase(createNewTask.rejected, (state, action: any) => {
      state.error = action.payload.message as string;
      state.isLoading = false;
    });
  },
});

export const {
  getIsAuth,
  setPrevEditTodo,
  setPrevEditTask,
  setPrevCreateTask,
  setPrevCreateSubTask,
  closeTodoForm,
} = appSlice.actions;
export default appSlice.reducer;