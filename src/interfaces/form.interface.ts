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