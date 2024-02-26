export type ResponseForm<T> = {
  result: true;
  code: 200;
  data: T;
};

export const createResponseForm = <T>(data: T): ResponseForm<T> => {
  return {
    result: true,
    code: 200,
    data,
  };
};
