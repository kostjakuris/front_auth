import { createSlice } from '@reduxjs/toolkit';


export interface AppState {
  isAuth: boolean;
  isTask: boolean;
  isCreateTask: boolean;
  isEditTask: boolean;
  isEditTodo: boolean;
  currentTodoId: number | null;
  currentTaskId: number | null;
  currentTodoName: string | null;
}

const initialState: AppState = {
  isAuth: false,
  isTask: false,
  isCreateTask: false,
  isEditTask: false,
  isEditTodo: false,
  currentTodoId: null,
  currentTaskId: null,
  currentTodoName: null,
};

const appSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    getIsAuth: (state) => {
      const isUserAuthorized = localStorage.getItem('isAuth');
      state.isAuth = isUserAuthorized === 'true';
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
    },
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