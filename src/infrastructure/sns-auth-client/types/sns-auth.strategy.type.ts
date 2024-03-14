import { CreateUserReqDto } from 'src/modules/users/dto/request/create-user.req.dto';

export type SnsAuthStrategy = {
  validate(snsAuthCode: string, snsAuthState: string): Promise<CreateUserReqDto>;
};
