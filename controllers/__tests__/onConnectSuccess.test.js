import request from 'supertest';
import app from '../../app.js';
// Mocking dependencies
jest.mock('../LoginV2/login-flows/auth.js', () => ({
  auth: {
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
              {
                name: 'twoFactor',
                type: 'text',
                placeholder: 'Enter 2FA code',
              },
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
              {
                name: 'email',
                type: 'email',
                placeholder: 'Enter admin email',
              },
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
  },
  returnedKeys: ['fields', 'buttons'],
}));

jest.mock('../LoginV2/login-flows/onSubmit.js', () => ({
  onSubmit: jest.fn(),
}));

jest.mock('../LoginV2/validation.js', () => ({
  validateForm: jest.fn(),
}));
describe('/api/authv2', () => {
  //success
  describe('GET /api/authv2 success cases ', () => {
    //response have to be json format
    test('json format in response', async () => {
      const response = await request(app).get('/api/authv2');
      expect(response.type).toBe('application/json');
    });

    //initialeStates
    test('GET request returns correct initial state', async () => {
      const response = await request(app).get('/api/authv2');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('standard');
      expect(response.body.standard).toHaveProperty('UI');
      expect(response.body).toHaveProperty('admin');
      expect(response.body.admin).toHaveProperty('UI');

      expect(response.body.standard.UI).toHaveProperty('fields');
      expect(response.body.standard.UI).toHaveProperty('buttons');
    });
  });

  describe('POST /api/authv2 success cases ', () => {
    //success
    test('POST request with valid data proceeds to next state', async () => {
      const { onSubmit } = require('../LoginV2/login-flows/onSubmit.js');
      onSubmit.mockResolvedValue({
        nextUI: 'twilioInputCode',
        data: {
          success: true,
          phoneNumber: '+21629635139',
          message: 'Verification code sent',
        },
      });
      const { validateForm } = require('../LoginV2/validation.js');
      validateForm.mockReturnValue({ isValid: true });
      const response = await request(app)
        .post('/api/authv2')
        .send({
          currentState: 'initialState',
          buttonId: 'btn_login_maximo',
          data: {
            login: 'medamin',
            ipAddress: 'https:192.168.1.108:4104',
            password: 'imaxeam',
          },
        });

      console.log(response.body);
      expect(response.status).toBe(200);

      // ///test if response bdyt be exist nextUI and data and ui
      expect(response.body).toHaveProperty('nextUI');
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('UI');
    });
  });
});
