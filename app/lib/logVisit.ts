import { userRequest } from '../api/v1/axios';

interface VisitPayload {
  page_url: string;
  referrer: string;
  user_agent: string;
  visited_at: string;
  session_id: string | null;
  visitor_id: string | null;
  device_type: string;
  language: string;
}

function getDeviceType(): string {
  if (typeof navigator === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (/Mobi|Android/i.test(ua)) return 'mobile';
  if (/Tablet|iPad/i.test(ua)) return 'tablet';
  return 'desktop';
}

function getOrSetVisitorId(): string | null {
  if (typeof localStorage === 'undefined') return null;
  let visitorId = localStorage.getItem('visitor_id');
  if (!visitorId) {
    visitorId = Math.random().toString(36).substr(2, 9) + Date.now();
    localStorage.setItem('visitor_id', visitorId);
  }
  return visitorId;
}

function getOrSetSessionId(): string | null {
  if (typeof sessionStorage === 'undefined' || typeof window === 'undefined') return null;
  const win = window as Window & { __session_id_initialized?: boolean };
  if (!win.__session_id_initialized) {
    const sessionId = Math.random().toString(36).substr(2, 9) + Date.now();
    sessionStorage.setItem('session_id', sessionId);
    win.__session_id_initialized = true;
    return sessionId;
  }
  return sessionStorage.getItem('session_id');
}

if (typeof window !== 'undefined') {
  const win = window as Window & { __session_id_initialized?: boolean };
  if (!sessionStorage.getItem('session_id')) {
      const sessionId = Math.random().toString(36).substr(2, 9) + Date.now();
      sessionStorage.setItem('session_id', sessionId);
  }
}

export async function logVisit() {
  if (typeof window === 'undefined') return;

  const sessionId = getOrSetSessionId();
  const pathname = window.location.pathname;
  const pageKey = `visit_logged_${sessionId}_${pathname}`;
  
  if (sessionStorage.getItem(pageKey)) return;
  sessionStorage.setItem(pageKey, '1');

  const payload: VisitPayload = {
    page_url: window.location.href,
    referrer: document.referrer || '',
    user_agent: navigator.userAgent,
    visited_at: new Date().toISOString(),
    session_id: sessionId,
    visitor_id: getOrSetVisitorId(),
    device_type: getDeviceType(),
    language: navigator.language || '',
  };

  try {
    // Use userRequest (axios) instead of fetch
    await userRequest.post('/api/visit-logs', payload);
  } catch (error) {
    // Silently fail for analytics
  }
}