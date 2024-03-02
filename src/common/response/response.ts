export type ResponseForm<T> = {
  isSuccess: true;
  code: 200;
  result: T;
};

export const createResponseForm = <T>(result: T): ResponseForm<T> => {
  return {
    isSuccess: true,
    code: 200,
    result,
  };
};
