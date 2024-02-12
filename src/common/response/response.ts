export interface ResponseForm<T> {
  result: true;
  code: 1000;
  data: T;
}

export const createResponseForm = <T>(data: T): ResponseForm<T> => {
  return {
    result: true,
    code: 1000,
    data,
  };
};
