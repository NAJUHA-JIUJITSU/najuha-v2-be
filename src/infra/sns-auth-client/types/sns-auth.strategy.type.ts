import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

export type SnsAuthStrategy = {
  validate(snsAuthCode: string, snsAuthState: string): Promise<CreateUserDto>;
};
