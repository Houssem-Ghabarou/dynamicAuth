import request from 'supertest';
import express from 'express';
import onConnect from '../LoginV2/onConnect.js';

const app = express();
app.use(express.json());
app.use('/api/connect', onConnect);

// Mock dependencies
jest.mock('./login-flows/auth.js', () => ({
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

describe('onConnect API', () => {
  // Success tests
  describe('Success scenarios', () => {
    test('GET request returns correct initial state', async () => {
      const response = await request(app).get('/api/connect');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('standard');
      expect(response.body.standard).toHaveProperty('UI');
    });

    test('POST request with valid data proceeds to next state', async () => {
      const { onSubmit } = require('./login-flows/onSubmit.js');
      onSubmit.mockResolvedValue({ success: true });
      const { validateForm } = require('./validation.js');
      validateForm.mockReturnValue({ isValid: true });

      const response = await request(app)
        .post('/api/connect')
        .send({
          currentState: 'initialState',
          buttonId: 'submit',
          data: { username: 'testuser' },
          userType: 'standard',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    test('POST request with noapicall button skips validation', async () => {
      const { auth } = require('./login-flows/auth.js');
      auth.flows.standard.states.initialState.buttons[0].noapicall = true;

      const response = await request(app).post('/api/connect').send({
        currentState: 'initialState',
        buttonId: 'submit',
        data: {},
        userType: 'standard',
      });

      expect(response.status).toBe(200);
    });
  });

  // Failure tests
  describe('Failure scenarios', () => {
    test('POST request with invalid user type returns 400', async () => {
      const response = await request(app).post('/api/connect').send({
        currentState: 'initialState',
        buttonId: 'submit',
        data: {},
        userType: 'invalid',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid user type');
    });

    test('POST request with invalid state returns 400', async () => {
      const response = await request(app).post('/api/connect').send({
        currentState: 'invalidState',
        buttonId: 'submit',
        data: {},
        userType: 'standard',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid state');
    });

    test('POST request with invalid button ID returns 400', async () => {
      const response = await request(app).post('/api/connect').send({
        currentState: 'initialState',
        buttonId: 'invalidButton',
        data: {},
        userType: 'standard',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid button ID');
    });
  });
});
