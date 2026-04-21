function resolveApiBase() {
  if (window.API_BASE) return window.API_BASE;

  const storedApiBase = localStorage.getItem('API_BASE');
  const { hostname, origin } = window.location;
  const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';

  if (storedApiBase) {
    try {
      const parsed = new URL(storedApiBase);
      const storedIsLocal = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';

      // Ignore stale localhost API_BASE values when running on a deployed URL.
      if (!(storedIsLocal && !isLocalHost)) {
        return storedApiBase;
      }

      localStorage.removeItem('API_BASE');
    } catch {
      localStorage.removeItem('API_BASE');
    }
  }

  // Keep local frontend -> local backend behavior for dev convenience.
  if (isLocalHost) {
    return `http://${hostname}:5000/api`;
  }

  // In deployed environments, default to same-origin API.
  return `${origin}/api`;
}

const API_BASE = resolveApiBase();
const SAME_ORIGIN_API_BASE = `${window.location.origin}/api`;

function getToken() {
  return localStorage.getItem('token');
}

async function apiRequest(path, options = {}) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const headers = {
    ...(options.headers || {}),
  };

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${normalizedPath}`, {
      ...options,
      headers,
    });
  } catch (networkError) {
    const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const shouldRetryWithSameOrigin = !isLocalHost && API_BASE !== SAME_ORIGIN_API_BASE;

    if (!shouldRetryWithSameOrigin) {
      throw networkError;
    }

    response = await fetch(`${SAME_ORIGIN_API_BASE}${normalizedPath}`, {
      ...options,
      headers,
    });
  }

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json().catch(() => ({}))
    : await response.text().catch(() => '');

  if (!response.ok) {
    throw new Error(
      typeof payload === 'string'
        ? payload || 'Request failed'
        : payload?.message || 'Request failed'
    );
  }

  return payload;
}

window.API_BASE = API_BASE;
window.getToken = getToken;
window.apiRequest = apiRequest;
window.apiFetch = apiRequest;
