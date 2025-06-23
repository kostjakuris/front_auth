export interface ListFormFields {
  listName: string;
}

export interface LoginFormFields {
  email: string;
  password: string;
}

export interface ForgotFormFields {
  email: string;
}

export interface ResetFormFields {
  password: string;
}

export interface RegisterFormFields {
  username: string;
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  token: string;
  password: string;
}

export interface CreateTaskFields {
  name: string;
  description: string;
  todoId: number;
  position: number;
  parentId?: number;
}

export interface EditTodoFields {
  name: string;
  id: number;
}

export interface EditTaskFields {
  name?: string;
  description?: string;
  status?: string;
  position: number;
  id: number;
}

export interface CreateRoomFields {
  name: string;
  ownerId: number;
}

export interface EditRoomFields {
  id: number;
  name: string;
  ownerId: number;
}

export interface DeleteRoomFields {
  id: number;
  ownerId: number;
}

