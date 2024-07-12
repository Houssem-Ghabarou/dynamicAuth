// auth.js
export const auth = {
  userTypes: ['standard', 'admin'],
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
          buttons: [
            {
              id: 'btn_forgot_password',
              text: 'Forgot Password',
              action: {
                nextUI: 'forgotPassword',
                api: '/api/standard/forgotpassword',
                method: 'POST',
              },
            },
            {
              id: 'btn_login',
              text: 'Login',
              action: {
                nextUI: 'success',
                api: 'https://jsonplaceholder.typicode.com/posts',
                method: 'POST',
              },
            },
          ],
        },
        forgotPassword: {
          screenTitle: 'Standard User Forgot Password',
          fields: [
            { name: 'email', type: 'email', placeholder: 'Enter email' },
          ],
          buttons: [
            {
              id: 'btn_reset_password',
              text: 'Reset Password',
              action: {
                nextUI: 'initialState',
                api: 'https://jsonplaceholder.typicode.com/todos/',
                method: 'POST',
              },
            },
            {
              id: 'btn_back_to_login',
              text: 'Back to Login',
              action: {
                nextUI: 'initialState',
              },
            },
          ],
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
          buttons: [
            {
              id: 'btn_admin_forgot_password',
              text: 'Forgot Password',
              action: {
                nextUI: 'forgotPassword',
                api: '/api/admin/forgotpassword',
                method: 'POST',
              },
            },
            {
              id: 'btn_admin_login',
              text: 'Login',
              action: {
                nextUI: 'success',
                api: '/api/admin/login',
                method: 'POST',
              },
            },
          ],
        },
        forgotPassword: {
          screenTitle: 'Admin Forgot Password',
          fields: [
            { name: 'email', type: 'email', placeholder: 'Enter admin email' },
          ],
          buttons: [
            {
              id: 'btn_admin_reset_password',
              text: 'Reset Password',
              action: {
                nextUI: 'initialState',
                api: '/api/admin/resetpassword',
                method: 'POST',
              },
            },
            {
              id: 'btn_admin_back_to_login',
              text: 'Back to Login',
              action: {
                nextUI: 'initialState',
              },
            },
          ],
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
  'buttons',
];
