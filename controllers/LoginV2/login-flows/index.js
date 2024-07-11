const OTPFlow = {
  handleAction(action, data) {
    switch (action) {
      case 'initialize':
        return {
          order: 'RENDER_OTP_INPUT',
          function: `
            async function submitOTP(otp) {
              const response = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'submitOTP', data: { otp } })
              });
              return await response.json();
            }
          `,
          message: 'Please enter the OTP sent to your phone',
        };
      case 'submitOTP':
        // Verify OTP logic here
        return {
          order: 'RENDER_PASSWORD_INPUT',
          function: `
            async function submitPassword(password) {
              const response = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'submitPassword', data: { password } })
              });
              return await response.json();
            }
          `,
          message: 'Please enter your password',
        };
      case 'submitPassword':
        // Verify password logic here
        return {
          order: 'RENDER_SUCCESS',
          message: 'Login successful',
        };
      default:
        throw new Error('Invalid action');
    }
  },
};

const StandardFlow = {
  handleAction(action, data) {
    switch (action) {
      case 'initialize':
        return {
          order: 'RENDER_LOGIN_FORM',
          function: `
            async function submitCredentials(username, password) {
              const response = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'submitCredentials', data: { username, password } })
              });
              return await response.json();
            }
          `,
          message: 'Please enter your username and password',
        };
      case 'submitCredentials':
        // Verify credentials logic here
        return {
          order: 'RENDER_SUCCESS',
          message: 'Login successful',
        };
      default:
        throw new Error('Invalid action');
    }
  },
};

export function getAuthFlow(loginMethod) {
  switch (loginMethod) {
    case 'OTP':
      return OTPFlow;
    case 'STANDARD':
      return StandardFlow;
    default:
      throw new Error('Invalid login method');
  }
}
