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
            fields: [{ name: 'username', required: true }],
            buttons: [
              { id: 'submit', text: 'Submit', action: { nextUI: 'nextState' } },
            ],
          },
          nextState: {},
        },
      },
      admin: {
        states: {
          initialState: {
            fields: [{ name: 'username', required: true }],
            buttons: [
              {
                id: 'submit',
                text: 'Submit',
                action: {
                  nextUI: 'nextState',
                  // api: 'https://localhost:4104/auth/verifyuserexist',
                  api: 'http://localhost:3001/api/fake',
                  method: 'POST',
                  dataToRetrieve: ['phoneNumber'],
                },
              },
            ],
          },
          nextState: {},
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
describe('POST /api/authv2', () => {
  //failure
  describe('api/authv2 failure cases ', () => {
    //GET

    //make the authjs broken to test this case
    // test('GET request returns  400 error if the authjs file have broken config', async () => {
    //   const response = await request(app).get('/api/authv2');
    //   expect(response.status).toBe(400);
    //   expect(response.body).toHaveProperty('error'); // Adjust based on your error response structure
    // });

    test('POST request  invallid button id ', async () => {
      const response = await request(app).post('/api/authv2').send({
        userType: 'admin',
        currentState: 'initialState',
        buttonId: 'btn_invaliiiiiiiiiiiiiid',
        data: {},
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('POST request  invalid state ', async () => {
      const response = await request(app).post('/api/authv2').send({
        userType: 'admin',
        currentState: 'invalidStateeeeeeeeeeeeeeeee',
        buttonId: '',
        data: {},
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('POST request  invalid data to the api or something to make the api invalid and check if validation.js is working ', async () => {
      const { validateForm } = require('../LoginV2/validation.js');
      validateForm.mockReturnValue({
        isValid: false,
        errors: {
          login: ['login is required'],
          password: ['password is required'],
          ipAddress: ['ipAddress is required'],
        },
      });

      const response = await request(app).post('/api/authv2').send({
        userType: 'admin',
        currentState: 'initialState',
        buttonId: 'submit',
        data: {},
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');

      //error object should be equal to the one returned from the validation function
      expect(response.body.error).toEqual({
        login: ['login is required'],
        password: ['password is required'],
        ipAddress: ['ipAddress is required'],
      });
    });

    //test with that api to see if the error is returned
    test('POST request  api returns error checking onSubmit function if it s returning well response', async () => {
      const { validateForm } = require('../LoginV2/validation.js');
      validateForm.mockReturnValue({ isValid: true });
      const { onSubmit } = require('../LoginV2/login-flows/onSubmit.js');
      onSubmit.mockResolvedValue({
        errorMessage: 'Internal server error',
      });

      const response = await request(app)
        .post('/api/authv2')
        .send({
          userType: 'admin',
          currentState: 'initialState',
          buttonId: 'submit',
          data: {
            login: 'medamin',
            ipAddress: 'ipAddress',
            password: 'imaxeam',
          },
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});
