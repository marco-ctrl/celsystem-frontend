// Generated by https://quicktype.io
import { User } from './user.interface';

export interface LoginResponse {
  status:  boolean;
  message: string;
  token:   string;
  user:    User;
}


