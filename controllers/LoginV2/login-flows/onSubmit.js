import axiosInstance from '../../../axios/index.js';

export async function onSubmit(nextUI, api, method, data) {
  try {
    if (api) {
      const result = await axiosInstance?.[method?.toLowerCase()](api, data);

      if (result?.status === 'error' || result?.data?.status === 'error') {
        const responseData = {
          errorMessage: result.message || result?.data?.message,
        };
        return responseData;
      } else {
        const responseData = {
          nextUI,
          data: result?.data,
        };
        return responseData;
      }
    } else {
      const responseData = {
        nextUI,
      };
      return responseData;
    }
  } catch (error) {
    console.error('Error in onSubmit:');
    console.log(error?.response?.data?.message);
    return {
      errorMessage:
        error?.response?.data?.message ||
        error.message ||
        'Internal server error',
    };
  }
}
