export type AuthAction = 'register' | 'login' | 'logout' | 'me';

//===============================================================

type AuthErrorConfig = {
  status: number;
  message: string;
};

//===============================================================

const AUTH_ERROR_MAP: Record<AuthAction, AuthErrorConfig[]> = {
  register: [
    { status: 400, message: 'Invalid registration data.' },
    { status: 409, message: 'Such email already exists.' },
    { status: 404, message: 'Service not found.' },
    { status: 500, message: 'Unable to register user.' },
  ],

  login: [
    { status: 400, message: 'Invalid login data.' },
    { status: 401, message: 'Email or password invalid.' },
    { status: 404, message: 'Service not found.' },
    { status: 500, message: 'Unable to login user.' },
  ],

  logout: [
    { status: 401, message: 'Unauthorized.' },
    { status: 500, message: 'Unable to sign out.' },
  ],

  me: [
    { status: 401, message: 'Unauthorized.' },
    { status: 500, message: 'Unable to get current user.' },
  ],
};

//===============================================================

export function getAuthErrorMessage(
  action: AuthAction,
  status: number,
  fallback?: string
): string {
  const matched = AUTH_ERROR_MAP[action].find((item) => item.status === status);

  if (matched) return matched.message;

  return fallback || 'Something went wrong.';
}
