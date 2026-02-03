const API_BASE = process.env.NEXT_PUBLIC_API_URL;
if (!API_BASE) {
  console.warn('NEXT_PUBLIC_API_URL is not set. API requests will be made relative to the frontend origin.');
}

async function parseResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const json = await res.json();
    if (!res.ok) throw json;
    return json;
  }

  // non-JSON response (likely HTML error page)
  const text = await res.text();
  const err = { ok: false, status: res.status, message: `Unexpected non-JSON response (status ${res.status})`, body: text };
  throw err;
}

export async function post(path, data) {
  const url = `${API_BASE || ''}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return parseResponse(res);
}

export async function get(path) {
  const url = `${API_BASE || ''}${path}`;
  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });
  return parseResponse(res);
}

export async function put(path, data) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}

export async function del(path) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}