export const parseApiError = (error: any) => {
  if (error?.response && error.response.data) {
    return error.response.data;
  }
  return error;
};
