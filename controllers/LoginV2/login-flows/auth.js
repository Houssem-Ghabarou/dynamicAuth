// auth.js
export const auth = {
  userTypes: ['standard', 'admin'],
  flows: {
    standard: {
      states: {
        initialState: {
          screenTitle: 'Twilio',
          titles: {
            title1: 'Welcome User',
            title2: 'Please Enter username and password',
          },
          fields: [
            {
              name: 'username',
              type: 'text',
              placeholder: 'Enter username',
              required: true,
            },
            {
              name: 'password',
              type: 'password',
              placeholder: 'Enter password',
              required: true,
            },
          ],
          descriptions: {
            description1: 'User login description',
          },
          buttons: [
            {
              id: 'btn_login_maximo',
              text: 'Continue to Maximo',
              action: {
                nextUI: 'twilioInputCode',

                api: 'http://localhost:3001/api/loginmaximo',
                method: 'POST',
              },
            },
          ],
        },
        twilioInputCode: {
          screenTitle: 'Enter Code',
          fields: [
            {
              name: 'code',
              type: 'number',
              placeholder: 'enter code',
              required: true,
              // length: 6,
            },
          ],
          buttons: [
            {
              id: 'verify_code',
              text: 'verify code',
              metadata: {},
              action: {
                nextUI: 'success',
                api: 'http://localhost:3001/api/twilio/confirm-code',
                method: 'POST',
              },
            },
            //resend code button
            // {
            //   type: 'primary',
            //   id: 'btn_resend_code',
            //   text: 'Resend Code',
            //   action: {
            //     nextUI: 'inputCode',
            //     api: 'https://jsonplaceholder.typicode.com/todos/',
            //     method: 'POST',
            //   },
            // },
            // {
            //   type: 'secondary',
            //   id: 'btn_back_to_otp_login',
            //   noapicall: true,
            //   text: 'Back to otp Login',
            //   action: {
            //     nextUI: 'initialState',
            //   },
            // },
          ],
        },
        success: {
          screenTitle: 'twilio User Login Successful',
          successMessage: 'twilio User Login Successful!',
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
