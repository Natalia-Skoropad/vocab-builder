import { NextResponse } from 'next/server';

//===============================================================

export async function parseServerJsonSafe<T>(
  response: Response
): Promise<T | null> {
  return (await response.json().catch(() => null)) as T | null;
}

//===============================================================

export function createErrorResponse(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

export function createOkResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}
