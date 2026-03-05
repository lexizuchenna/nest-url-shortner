interface IUrl {
  id: string;
  shortened_url: string;
  original_url: string;
  created_at: string;
}

interface IRes<T> {
  success: boolean;
  error?: string;
  data?: T;
  message: string;
  statusCode: HttpStatus;
}
