import { ReadUserDto } from '../../user/dto/read-user.dto';

export interface LoginStatus {
  accessToken: string;
  expiresIn: string;
  user: ReadUserDto
}