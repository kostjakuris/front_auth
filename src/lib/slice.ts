import { createSlice } from '@reduxjs/toolkit';


export interface AppState {
  isAuth: boolean;
  isTask: boolean;
  isCreateTask: boolean;
  isEditMessage: boolean;
  isEditTask: boolean;
  isCreateRoom: boolean;
  isEditRoom: boolean;
  isEditTodo: boolean;
  isChat: boolean;
  isRooms: boolean;
  isUsersList: boolean;
  userName: string | null;
  currentRoom: string | null;
  currentRoomId: string | null;
  currentTodoId: number | null;
  userId: number | null;
  ownerId: number | null;
  chatMessage: string | null;
  currentTaskId: number | null;
  currentTodoName: string | null;
}

const initialState: AppState = {
  isAuth: false,
  isTask: false,
  isCreateTask: false,
  isEditMessage: false,
  isCreateRoom: false,
  isEditRoom: false,
  isChat: false,
  isRooms: false,
  isUsersList: false,
  isEditTask: false,
  isEditTodo: false,
  currentTodoId: null,
  currentTaskId: null,
  currentRoom: null,
  chatMessage: null,
  currentRoomId: null,
  userId: null,
  ownerId: null,
  currentTodoName: null,
  userName: null,
};

const appSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    getIsAuth: (state) => {
      const isUserAuthorized = localStorage.getItem('isAuth');
      state.isAuth = isUserAuthorized === 'true';
    },
    setChatMessage: (state, action) => {
      state.chatMessage = action.payload;
    },
    setIsEditMessage: (state, action) => {
      state.isEditMessage = action.payload;
    },
    setIsChat: (state, action) => {
      state.isChat = action.payload;
    },
    setIsRooms: (state, action) => {
      state.isRooms = action.payload;
    },
    setIsUsersList: (state, action) => {
      state.isUsersList = action.payload;
    },
    setIsCreateRoom: (state, action) => {
      state.isCreateRoom = action.payload;
    },
    setIsEditRoom: (state, action) => {
      state.isEditRoom = action.payload;
    },
    setOwnerId: (state, action) => {
      state.ownerId = action.payload;
    },
    setCurrentRoom: (state, action) => {
      state.currentRoom = action.payload;
    },
    setCurrentRoomId: (state, action) => {
      state.currentRoomId = action.payload;
    },
    closeTodoForm: (state) => {
      state.isCreateTask = false;
      state.isTask = false;
      state.isEditTask = false;
      state.isEditTodo = false;
    },
    setUserInfo: (state, action) => {
      state.userName = action.payload.userName;
      state.userId = action.payload.userId;
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
        state.isEditTask = !state.isEditTask;
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
  setUserInfo,
  setIsEditMessage,
  setCurrentRoomId,
  setCurrentRoom,
  setChatMessage,
  setOwnerId,
  setIsCreateRoom,
  setIsEditRoom,
  setIsChat,
  setIsRooms,
  setIsUsersList
} = appSlice.actions;
export default appSlice.reducer;