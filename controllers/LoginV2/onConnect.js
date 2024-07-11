import { auth, returnedKeys } from './login-flows/auth.js';
import { onSubmit } from './login-flows/onSubmit.js';

const onConnect = async (req, res) => {
  if (req.method === 'GET') {
    const { state } = req.query;
    console.log(state || 'no state provided in initiale', 'currentState');

    const initialState = auth?.states?.[state] || auth?.states?.initialState;

    const response = {};
    returnedKeys.forEach((key) => {
      if (initialState[key]) {
        response[key] = initialState?.[key];
      }
    });

    response.actions = Object.keys(initialState).filter(
      (key) => !returnedKeys?.includes(key)
    );

    res.json(response);
  } else if (req.method === 'POST') {
    const { currentState, action, data } = req.body;
    const state = auth?.states?.[currentState];

    if (!state) {
      return res.status(400).json({ error: 'Invalid state' });
    }

    const actionConfig = state?.[action];

    if (!actionConfig) {
      return res.status(400).json({ error: 'Invalid action' });
    }

    try {
      const responseData = await onSubmit(
        actionConfig?.nextUI,
        actionConfig?.api,
        actionConfig?.method,
        data
      );

      if (responseData?.errorMessage) {
        return res.status(400).json({ error: responseData.errorMessage });
      }

      const nextState = auth?.states[actionConfig?.nextUI];

      if (nextState) {
        returnedKeys.forEach((key) => {
          if (nextState[key]) {
            responseData[key] = nextState[key];
          }
        });

        responseData.actions = Object?.keys(nextState).filter(
          (key) => !returnedKeys.includes(key)
        );
      }

      res.json(responseData);
    } catch (error) {
      console.error('Error in onConnect:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

export default onConnect;
