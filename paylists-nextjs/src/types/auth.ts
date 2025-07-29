// types/auth.ts
export interface LoginForm {
    email: string
    password: string
  }
  
  export interface LoginResponse {
    token: string
    user: {
      id: string
      email: string
    }
  }
  
  export interface RegisterForm {
    email: string
    password: string
  }
  
  export interface RegisterResponse {
    token: string
    user: {
      id: string
      email: string
    }
  }  