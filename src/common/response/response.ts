export type ResponseForm<Result> = {
  isSuccess: true;
  code: 200;
  result: Result | void;
};

export const createResponseForm = <Result>(result: Result | void): ResponseForm<Result> => {
  return {
    isSuccess: true,
    code: 200,
    result,
  };
};
