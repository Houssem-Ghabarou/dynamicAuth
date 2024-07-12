// auth.js
export const auth = {
  userTypes: ['standard', 'admin'], // Add or remove user types as needed
  flows: {
    standard: {
      states: {
        initialState: {
          screenTitle: 'Standard User Login',
          titles: {
            title1: 'Welcome Standard User',
            title2: 'Please log in',
          },
          fields: [
            { name: 'username', type: 'text', placeholder: 'Enter username' },
            {
              name: 'password',
              type: 'password',
              placeholder: 'Enter password',
            },
          ],
          descriptions: {
            description1: 'Standard user login description',
          },
          onClickForgotPassword: {
            nextUI: 'forgotPassword',
            api: '/api/standard/forgotpassword',
            method: 'POST',
          },
          onSubmitFinally: {
            nextUI: 'success',
            api: 'https://jsonplaceholder.typicode.com/posts',
            method: 'POST',
          },
        },
        forgotPassword: {
          screenTitle: 'Standard User Forgot Password',
          fields: [
            { name: 'email', type: 'email', placeholder: 'Enter email' },
          ],
          onSubmitFinally: {
            nextUI: 'initialState',
            api: '/api/standard/resetpassword',
            method: 'POST',
          },
          onClickBack: {
            nextUI: 'initialState',
          },
        },
        success: {
          screenTitle: 'Standard User Login Successful',
          successMessage: 'Standard User Login Successful!',
        },
      },
    },
    admin: {
      states: {
        initialState: {
          screenTitle: 'Admin Login',
          titles: {
            title1: 'Welcome Admin',
            title2: 'Please log in',
          },
          fields: [
            {
              name: 'username',
              type: 'text',
              placeholder: 'Enter admin username',
            },
            {
              name: 'password',
              type: 'password',
              placeholder: 'Enter admin password',
            },
            { name: 'twoFactor', type: 'text', placeholder: 'Enter 2FA code' },
          ],
          descriptions: {
            description1: 'Admin login description',
          },
          onClickForgotPassword: {
            nextUI: 'forgotPassword',
            api: '/api/admin/forgotpassword',
            method: 'POST',
          },
          onSubmitFinally: {
            nextUI: 'success',
            api: '/api/admin/login',
            method: 'POST',
          },
        },
        forgotPassword: {
          screenTitle: 'Admin Forgot Password',
          fields: [
            { name: 'email', type: 'email', placeholder: 'Enter admin email' },
          ],
          onSubmitFinally: {
            nextUI: 'initialState',
            api: '/api/admin/resetpassword',
            method: 'POST',
          },
          onClickBack: {
            nextUI: 'initialState',
          },
        },
        success: {
          screenTitle: 'Admin Login Successful',
          successMessage: 'Admin Login Successful!',
        },
      },
    },
  },
};

export const returnedKeys = [
  'screenTitle',
  'fields',
  'titles',
  'successMessage',
  'descriptions',
];
