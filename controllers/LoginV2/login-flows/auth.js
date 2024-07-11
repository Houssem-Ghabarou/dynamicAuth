export const auth = {
  states: {
    initialState: {
      screenTitle: 'LoginScreen',
      titles: {
        title1: 'Text Field Title',
        title2: 'This is a generic Description.',
      },

      fields: [
        { name: 'username', type: 'text', placeholder: 'Enter username' },
        { name: 'password', type: 'password', placeholder: 'Enter password' },
        //email
        { name: 'email', type: 'email', placeholder: 'Enter email' },
      ],

      onClickForgotPassword: {
        nextUI: 'forgotPassword',
        api: '/api/forgotpassword',
        method: 'POST',
      },
      onSubmitFinally: {
        nextUI: 'success',
        api: 'https://jsonplaceholder.typicode.com/posts',
        method: 'POST',
      },
    },
    forgotPassword: {
      screenTitle: 'ForgotPasswordScreen',
      fields: [{ name: 'email', type: 'email', placeholder: 'Enter email' }],
      onSubmitFinally: {
        nextUI: 'initialState',
        api: 'http://localhost:3000/',
        method: 'GET',
      },
      onClickBack: {
        nextUI: 'initialState',
      },
    },
    success: {
      screenTitle: 'SuccessScreen',
      successMessage: 'Login Successful!',
    },
  },
};

export const returnedKeys = [
  'screenTitle',
  'fields',
  'titles',
  'successMessage',
];
