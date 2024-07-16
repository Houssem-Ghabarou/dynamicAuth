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
            {
              name: 'username',
              type: 'text',
              placeholder: 'Enter username',
              required: true,
            },
            {
              name: 'email',
              type: 'email',
              placeholder: 'Enter email',
              required: true,
            },
            {
              name: 'SAMLURL',
              type: 'text',
              placeholder: 'SAMLURL',
              required: true,
              length: 10,
            },
          ],
          descriptions: {
            description1: 'otp login with phone',
          },
          buttons: [
            {
              id: 'btn_send_code1',
              text: 'Send code',
              action: {
                nextUI: 'inputCode',

                api: 'https://jsonplaceholder.typicode.com/posts',
                method: 'POST',
              },
            },

            // {
            //   id: 'btn_send_code2',
            //   text: 'Send code',
            //   action: {
            //     nextUI: 'inputCode',
            //     api: 'https://jsonplaceholder.typicode.com/todos/1',
            //     method: 'POST',
            //   },
            // },
            // {
            //   id: 'btn_send_code3',
            //   text: 'Send code',
            //   action: {
            //     nextUI: 'inputCode',
            //     api: 'https://jsonplaceholder.typicode.com/todos/1',
            //     method: 'POST',
            //   },
            // },
          ],
        },
        inputCode: {
          screenTitle: 'Enter Code',
          fields: [
            {
              name: 'code',
              type: 'number',
              placeholder: 'enter code',
              required: true,
              length: 6,
            },
          ],
          buttons: [
            {
              id: 'verify_code',
              text: 'verify code',
              metadata: {},
              action: {
                nextUI: 'success',
                api: 'https://jsonplaceholder.typicode.com/todos/',
                method: 'POST',
              },
            },
            //resend code button
            {
              type: 'primary',
              id: 'btn_resend_code',
              text: 'Resend Code',
              action: {
                nextUI: 'inputCode',
                api: 'https://jsonplaceholder.typicode.com/todos/',
                method: 'POST',
              },
            },
            {
              type: 'secondary',
              id: 'btn_back_to_otp_login',
              noapicall: true,
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
