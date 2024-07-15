// auth.js
export const auth = {
  userTypes: ['standard', 'admin'],
  flows: {
    standard: {
      states: {
        initialState: {
          screenTitle: 'OTP LOGIN',
          titles: {
            title1: 'Welcome User',
            title2: 'Please log in with otp',
          },
          fields: [
            { name: 'username', type: 'text', placeholder: 'Enter username' },
            { name: 'username', type: 'text', placeholder: 'Enter username' },
            { name: 'username', type: 'text', placeholder: 'Enter username' },
            { name: 'username', type: 'text', placeholder: 'Enter username' },

            {
              name: 'phone',
              type: 'phone',
              placeholder: 'Enter Phone',
            },
          ],
          descriptions: {
            description1: 'otp login with phone',
          },
          buttons: [
            {
              id: 'btn_send_code',
              text: 'Send code',
              action: {
                nextUI: 'inputCode',
                api: 'https://jsonplaceholder.typicode.com/todos/1',
                method: 'POST',
              },
            },
            {
              id: 'btn_send_code',
              text: 'Send code',
              action: {
                nextUI: 'inputCode',
                api: 'https://jsonplaceholder.typicode.com/todos/1',
                method: 'POST',
              },
            },
            {
              id: 'btn_send_code',
              text: 'Send code',
              action: {
                nextUI: 'inputCode',
                api: 'https://jsonplaceholder.typicode.com/todos/1',
                method: 'POST',
              },
            },
          ],
        },
        inputCode: {
          screenTitle: 'Enter Code',
          fields: [{ name: 'code', type: 'code', placeholder: 'enter code' }],
          buttons: [
            {
              id: 'verify_code',
              text: 'verify code',
              action: {
                nextUI: 'success',
                api: 'https://jsonplaceholder.typicode.com/todos/',
                method: 'POST',
              },
            },
            //resend code button
            {
              id: 'btn_resend_code',
              text: 'Resend Code',
              action: {
                api: 'https://jsonplaceholder.typicode.com/todos/',
                method: 'POST',
              },
            },
            {
              id: 'btn_back_to_otp_login',
              text: 'Back to otp Login',
              action: {
                nextUI: 'initialState',
              },
            },
          ],
        },
        success: {
          screenTitle: 'OTP User Login Successful',
          successMessage: 'OTP User Login Successful!',
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
