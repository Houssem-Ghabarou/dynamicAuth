import { auth, returnedKeys } from './login-flows/auth.js';
import { onSubmit } from './login-flows/onSubmit.js';

const onConnect = async (req, res) => {
  if (req?.method === 'GET') {
    const { state = 'initialState' } = req?.query;
    console.log(state || 'no state provided in initial', 'currentState');

    const response = {};

    // Process each user type
    for (const userType of auth?.userTypes) {
      const flow = auth?.flows?.[userType];
      const currentState = flow?.states?.[state] || flow?.states?.initialState;

      response[userType] = {
        UI: {},
      };

      returnedKeys.forEach((key) => {
        if (currentState[key]) {
          response[userType].UI[key] = currentState?.[key];
        }
      });

      // Include buttons in the UI object
      if (currentState.buttons) {
        response[userType].UI.buttons = currentState.buttons.map((button) => ({
          id: button.id,
          text: button.text,
        }));
      }
    }

    res.json(response);
  } else if (req?.method === 'POST') {
    const { currentState, buttonId, data, userType = 'standard' } = req.body;

    if (!auth.userTypes.includes(userType)) {
      return res.status(400).json({ error: 'Invalid user type' });
    }

    const flow = auth?.flows?.[userType];
    const state = flow?.states?.[currentState];

    if (!state) {
      return res.status(400).json({ error: 'Invalid state' });
    }

    const button = state.buttons?.find((btn) => {
      return btn.id === buttonId;
    });

    if (!button) {
      return res.status(400).json({ error: 'Invalid button ID' });
    }

    const actionConfig = button.action;

    console.log(actionConfig, 'actionConfig');
    try {
      const responseData = await onSubmit(
        actionConfig.nextUI,
        actionConfig.api,
        actionConfig.method,
        data
      );

      if (responseData?.errorMessage) {
        return res.status(400).json({ error: responseData?.errorMessage });
      }

      const nextState = flow?.states?.[actionConfig?.nextUI];

      if (nextState) {
        responseData.UI = {};
        returnedKeys.forEach((key) => {
          if (nextState[key]) {
            responseData.UI[key] = nextState?.[key];
          }
        });

        // Include buttons in the UI object for the next state
        if (nextState.buttons) {
          responseData.UI.buttons = nextState.buttons.map((button) => ({
            id: button.id,
            text: button.text,
          }));
        }
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
