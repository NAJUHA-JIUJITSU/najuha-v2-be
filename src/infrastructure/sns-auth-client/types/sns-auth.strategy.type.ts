import { CreateUserReqDto } from 'src/modules/users/structure/dto/request/create-user.req.dto';

export type SnsAuthStrategy = {
  validate(snsAuthCode: string, snsAuthState: string): Promise<CreateUserReqDto>;
};
