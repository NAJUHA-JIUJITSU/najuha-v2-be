import { CreateUserDto } from 'src/users/dto/create-user.dto';

export interface SnsAuthStrategy {
  validate(snsAuthCode: string, snsAuthState: string): Promise<CreateUserDto>;
}
