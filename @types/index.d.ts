interface IUrl {
  id: string;
  shortened_url: string;
  original_url: string;
  created_at: string | Date;
  updated_at?: string | Date;
}

interface IUser {
  name: string;
  email: string;
  password: string;
  created_at: string | Date;
}

interface IRes<T> {
  success: boolean;
  error?: string;
  data?: T;
  message: string;
  statusCode: HttpStatus;
}
