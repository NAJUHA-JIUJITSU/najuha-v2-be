import typia from 'typia';

export type PhoneNumberAuthCode = string & typia.tags.Pattern<'^[0-9]{6}$'>;
