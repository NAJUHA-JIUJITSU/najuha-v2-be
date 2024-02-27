import { PolicyEntity } from 'src/policy/entities/policy.entity';
import { UserEntity } from 'src/users/entities/user.entity';

export type RegisterDto = {
  user: Pick<UserEntity, 'nickname' | 'gender' | 'belt' | 'birth'> & {
    nickname: string;
    birth: string;
    gender: 'MALE' | 'FEMALE';
    belt: '선택없음' | '화이트' | '블루' | '퍼플' | '브라운' | '블랙';
  };
  consentPolicyTypes: PolicyEntity['type'][];
};
