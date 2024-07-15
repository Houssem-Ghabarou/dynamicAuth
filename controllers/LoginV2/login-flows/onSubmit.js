export async function onSubmit(nextUI, api, method, data) {
  // console.log(api, 'api');
  // console.log(data, 'data');
  // console.log(method, 'method');
  let responseData;

  try {
    if (api) {
      const response = await fetch(api, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      // console.log(response, 'result');
      const result = await response.json();

      console.log(result, 'result');
      if (result.status === 'error') {
        responseData = {
          errorMessage: result.message,
        };
      } else {
        responseData = {
          nextUI,
          data: result,
        };
      }
    } else {
      responseData = {
        nextUI,
      };
    }

    return responseData;
  } catch (error) {
    console.error('Error in onSubmit:', error);
    return {
      errorMessage:
        //specify whcih api
        ` Error in ${api} API: ${error.message} `,
    };
  }
}
