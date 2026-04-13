import { NextResponse } from 'next/server';

import { API_BASE_URL } from '@/lib/constants/api';
import { setAuthTokenCookie } from '@/lib/server/auth/token';
import type { BackendAuthResponse } from '@/types/auth';

//===============================================================

type RegisterRequestBody = {
  name?: string;
  email?: string;
  password?: string;
};

//===============================================================

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterRequestBody;

    const response = await fetch(`${API_BASE_URL}/users/signup`, {
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
            { message: 'Invalid registration data.' },
            { status: 400 }
          );
        case 409:
          return NextResponse.json(
            { message: 'Such email already exists.' },
            { status: 409 }
          );
        case 404:
          return NextResponse.json(
            { message: 'Service not found.' },
            { status: 404 }
          );
        default:
          return NextResponse.json(
            { message: 'Registration failed.' },
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

    return NextResponse.json(
      {
        user: {
          name: data.name,
          email: data.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/auth/register error:', error);

    return NextResponse.json(
      { message: 'Unable to register user.' },
      { status: 500 }
    );
  }
}
