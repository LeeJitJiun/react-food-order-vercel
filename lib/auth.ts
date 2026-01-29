import { cookies } from 'next/headers';

export async function getAuthenticatedUserId(): Promise<string | null> {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;
    return userId || null;
}
