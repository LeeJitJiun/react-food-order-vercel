import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getAuthenticatedUserId(): Promise<string | null> {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;
    return userId || null;
}

export async function requireAuth(): Promise<string> {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
        redirect('/auth-required');
    }
    return userId;
}

export async function isAuthenticated(): Promise<boolean> {
    const userId = await getAuthenticatedUserId();
    return !!userId;
}
