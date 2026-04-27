import type { AppUser } from '@/types/auth';
import { parseClientAuthResponse } from '@/lib/auth/auth-response';

//===============================================================

type RegisterParams = {
  name: string;
  email: string;
  password: string;
};

type LoginParams = {
  email: string;
  password: string;
};

type AuthResponse = {
  user?: AppUser;
  message?: string;
  ok?: boolean;
};

//===============================================================

async function registerUser(data: RegisterParams): Promise<AppUser> {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = (await parseClientAuthResponse(
    response,
    'Registration failed.'
  )) as AuthResponse;

  if (!result.user) {
    throw new Error('Registration failed.');
  }

  return result.user;
}

//===============================================================

async function loginUser(data: LoginParams): Promise<AppUser> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = (await parseClientAuthResponse(
    response,
    'Login failed.'
  )) as AuthResponse;

  if (!result.user) {
    throw new Error('Login failed.');
  }

  return result.user;
}

//===============================================================

async function getCurrentUser(): Promise<AppUser | null> {
  const response = await fetch('/api/auth/me', {
    method: 'GET',
    cache: 'no-store',
  });

  if (response.status === 401) {
    return null;
  }

  const result = (await parseClientAuthResponse(
    response,
    'Failed to fetch current user.'
  )) as AuthResponse;

  return result.user ?? null;
}

//===============================================================

async function logoutUser(): Promise<void> {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
  });

  await parseClientAuthResponse(response, 'Failed to sign out.');
}

//===============================================================

export const authService = {
  register: registerUser,
  login: loginUser,
  getCurrentUser,
  logout: logoutUser,
};
