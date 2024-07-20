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
              name: 'login',
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
            //ipAddress
            {
              name: 'ipAddress',
              type: 'text',
              placeholder: 'Enter IP Address',
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

                api: 'https://localhost:4104/auth/verifyuserexist',
                method: 'POST',
                dataToRetrieve: ['phoneNumber'],
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
                api: 'https://localhost:4104/auth/verifyOTP',
                method: 'POST',
                OnSubmitFinally: true, // Add this flag
              },
            },
          ],
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
