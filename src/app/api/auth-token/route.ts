// import { cookies } from 'next/headers';
// import { NextResponse } from 'next/server';

// export async function GET() {
//   const token = cookies().get('authToken')?.value;
//   return NextResponse.json({ token });
// }

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies(); // Add await here
  const token = cookieStore.get('authToken')?.value;
  return NextResponse.json({ token });
}