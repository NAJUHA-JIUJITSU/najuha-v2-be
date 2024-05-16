import { IPolicy } from 'src/modules/policy/domain/interface/policy.interface';
import { uuidv7 } from 'uuidv7';

export const dummyPolicies: IPolicy[] = [
  {
    id: uuidv7(),
    version: 1,
    type: 'TERMS_OF_SERVICE',
    isMandatory: true,
    title: '서비스 이용 약관',
    content: '서비스 이용 약관 내용',
    createdAt: new Date(),
  },
  {
    id: uuidv7(),
    version: 1,
    type: 'PRIVACY',
    isMandatory: true,
    title: '개인정보 처리 방침',
    content: '개인정보 처리 방침 내용',
    createdAt: new Date(),
  },
  {
    id: uuidv7(),
    version: 1,
    type: 'REFUND',
    isMandatory: true,
    title: '환불 정책',
    content: '환불 정책 내용',
    createdAt: new Date(),
  },
  {
    id: uuidv7(),
    version: 1,
    type: 'ADVERTISEMENT',
    isMandatory: false,
    title: '광고정책',
    content: '광고정책 내용',
    createdAt: new Date(),
  },
];
