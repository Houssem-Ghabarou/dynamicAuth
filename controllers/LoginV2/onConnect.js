import { auth, returnedKeys } from './login-flows/auth.js';
import { onSubmit } from './login-flows/onSubmit.js';
import { validateForm } from './validation.js';
const onConnect = async (req, res) => {
  if (req?.method === 'GET') {
    const { state = 'initialState' } = req?.query;
    // console.log(state || 'no state provided in initial', 'currentState');

    const response = {};

    // Processing each user type
    for (const userType of auth?.userTypes) {
      const flow = auth?.flows?.[userType];
      if (!flow) {
        /// go to next iteration or if it s on last iteration then break
        continue;
      }
      const currentState = flow?.states?.[state] || flow?.states?.initialState;

      response[userType] = {
        UI: {},
      };

      returnedKeys?.forEach((key) => {
        if (currentState?.[key]) {
          response[userType].UI[key] = currentState?.[key];
        }
      });

      // Includeing buttons in the UI object
      if (currentState?.buttons) {
        response[userType].UI.buttons = currentState?.buttons?.map(
          (button) => ({
            id: button?.id,
            text: button?.text,
            action: button?.action,
          })
        );
      }
    }

    res.json(response);
  } else if (req?.method === 'POST') {
    console.log(req?.body, 'req.body');
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

    //fileds validation
    const fields = state?.fields;

    //work only if noapicall is not present in the button
    if (fields && !button?.noapicall) {
      const { isValid, errors } = validateForm(fields, data);

      // console.log(isValid, 'isValid');
      // console.log(errors, 'errors');

      if (!isValid) {
        return res.status(400).json({ error: errors });
      }
    }

    const actionConfig = button?.action;

    // console.log(actionConfig, 'actionConfig');
    try {
      const responseData = await onSubmit(
        actionConfig?.nextUI,
        actionConfig?.api,
        actionConfig?.method,
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

        // Including buttons in the UI object for the next state
        if (nextState.buttons) {
          responseData.UI.buttons = nextState.buttons.map((button) => ({
            id: button?.id,
            text: button?.text,
            //action
            action: button?.action,
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
