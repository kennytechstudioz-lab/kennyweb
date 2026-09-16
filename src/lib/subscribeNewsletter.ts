const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8003';

export type SubscribeStatus = 'success' | 'already_subscribed' | 'error';

export interface SubscribeResult {
  status: SubscribeStatus;
  message: string;
}

export async function subscribeToNewsletter(email: string): Promise<SubscribeResult> {
  try {
    const res = await fetch(`${API_URL}/api/subscribers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    return {
      status: data.status as SubscribeStatus,
      message: data.message,
    };
  } catch {
    return {
      status: 'error',
      message: 'Unable to connect. Please check your internet connection and try again.',
    };
  }
}
