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

      response[userType] = {};

      let UI = {};
      returnedKeys.forEach((key) => {
        if (currentState[key]) {
          // response[userType][key] = currentState?.[key];
          UI[key] = currentState?.[key];
          response[userType].UI = UI;
        }
      });

      response[userType].UI.actions = Object?.keys(currentState)?.filter(
        (key) => !returnedKeys?.includes(key)
      );
    }

    res.json(response);
  } else if (req?.method === 'POST') {
    const { currentState, action, data, userType = 'standard' } = req.body;

    if (!auth.userTypes.includes(userType)) {
      return res.status(400).json({ error: 'Invalid user type' });
    }

    const flow = auth?.flows?.[userType];
    const state = flow?.states?.[currentState];

    if (!state) {
      return res.status(400).json({ error: 'Invalid state' });
    }

    const actionConfig = state?.[action];

    if (!actionConfig) {
      return res.status(400).json({ error: 'Invalid action' });
    }

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

      let UI = {};
      if (nextState) {
        returnedKeys.forEach((key) => {
          if (nextState[key]) {
            UI[key] = nextState?.[key];
          }
        });

        responseData.UI = UI;

        responseData.UI.actions = Object?.keys(nextState)?.filter(
          (key) => !returnedKeys?.includes(key)
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
