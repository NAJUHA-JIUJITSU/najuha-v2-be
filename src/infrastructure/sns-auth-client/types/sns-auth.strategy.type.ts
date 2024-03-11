import { CreateUserDto } from 'src/modules/users/presentation/dto/create-user.dto';

export type SnsAuthStrategy = {
  validate(snsAuthCode: string, snsAuthState: string): Promise<CreateUserDto>;
};
