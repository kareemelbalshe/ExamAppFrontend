export interface User {
}



export interface Student {
  id: number;
  username: string;
  email: string;
  role: string;
  isDeleted: boolean;
  password?: string;
}


export interface CreateStudent {
  username: string;
  email: string;
  password: string;
}
