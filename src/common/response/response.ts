export type ResponseForm<Result> = {
  isSuccess: true;
  code: 200;
  result: Result;
};

export const createResponseForm = <Result>(result: Result): ResponseForm<Result> => {
  return {
    isSuccess: true,
    code: 200,
    result,
  };
};
