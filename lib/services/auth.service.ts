import type { AppUser } from '@/types/auth';

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
  user: AppUser;
  message?: string;
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

  const result = (await response
    .json()
    .catch(() => null)) as AuthResponse | null;

  if (!response.ok || !result?.user) {
    throw new Error(result?.message || 'Registration failed.');
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

  const result = (await response
    .json()
    .catch(() => null)) as AuthResponse | null;

  if (!response.ok || !result?.user) {
    throw new Error(result?.message || 'Login failed.');
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

  const result = (await response
    .json()
    .catch(() => null)) as AuthResponse | null;

  if (!response.ok || !result?.user) {
    throw new Error(result?.message || 'Failed to fetch current user.');
  }

  return result.user;
}

//===============================================================

async function logoutUser(): Promise<void> {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
  });

  const result = (await response.json().catch(() => null)) as {
    message?: string;
    ok?: boolean;
  } | null;

  if (!response.ok) {
    throw new Error(result?.message || 'Failed to sign out.');
  }
}

//===============================================================

export const authService = {
  register: registerUser,
  login: loginUser,
  getCurrentUser,
  logout: logoutUser,
};
