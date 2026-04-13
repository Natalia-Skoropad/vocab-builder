import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/constants/api';

import {
  getAuthTokenCookie,
  clearAuthTokenCookie,
} from '@/lib/server/auth/token';

import type { BackendCurrentUserResponse } from '@/types/auth';

//===============================================================

export async function GET() {
  try {
    const token = await getAuthTokenCookie();

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const response = await fetch(`${API_BASE_URL}/users/current`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (response.status === 401) {
      await clearAuthTokenCookie();

      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!response.ok) {
      return NextResponse.json(
        { message: 'Unable to get current user.' },
        { status: response.status || 500 }
      );
    }

    const data = (await response.json()) as BackendCurrentUserResponse;

    return NextResponse.json({
      user: {
        id: data._id,
        name: data.name,
        email: data.email,
      },
    });
  } catch (error) {
    console.error('GET /api/auth/me error:', error);

    return NextResponse.json(
      { message: 'Unable to get current user.' },
      { status: 500 }
    );
  }
}
