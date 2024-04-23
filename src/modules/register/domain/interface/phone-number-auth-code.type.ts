import typia from 'typia';

/** 휴대폰 인증 코드. */
export type PhoneNumberAuthCode = string & typia.tags.Pattern<'^[0-9]{6}$'>;
