const API_BASE =
  window.API_BASE ||
  localStorage.getItem('API_BASE') ||
  'http://localhost:5000/api';

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

  const response = await fetch(`${API_BASE}${normalizedPath}`, {
    ...options,
    headers,
  });

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
