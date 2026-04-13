import { NextResponse } from 'next/server';

import { API_BASE_URL } from '@/lib/constants/api';
import { setAuthTokenCookie } from '@/lib/server/auth/token';
import type { BackendAuthResponse } from '@/types/auth';

//===============================================================

type LoginRequestBody = {
  email?: string;
  password?: string;
};

//===============================================================

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginRequestBody;

    const response = await fetch(`${API_BASE_URL}/users/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const data = (await response.json().catch(() => null)) as
      | BackendAuthResponse
      | { message?: string }
      | null;

    if (!response.ok) {
      switch (response.status) {
        case 400:
          return NextResponse.json(
            { message: 'Invalid login data.' },
            { status: 400 }
          );
        case 401:
          return NextResponse.json(
            { message: 'Email or password invalid.' },
            { status: 401 }
          );
        case 404:
          return NextResponse.json(
            { message: 'Service not found.' },
            { status: 404 }
          );
        default:
          return NextResponse.json(
            { message: 'Login failed.' },
            { status: response.status || 500 }
          );
      }
    }

    if (!data || !('token' in data)) {
      return NextResponse.json(
        { message: 'Invalid server response.' },
        { status: 500 }
      );
    }

    await setAuthTokenCookie(data.token);

    return NextResponse.json({
      user: {
        name: data.name,
        email: data.email,
      },
    });
  } catch (error) {
    console.error('POST /api/auth/login error:', error);

    return NextResponse.json(
      { message: 'Unable to login user.' },
      { status: 500 }
    );
  }
}
