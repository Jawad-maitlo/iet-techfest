window.ContentAPI = (() => {
  const base = (window.APP_CONFIG?.apiBaseUrl || '').replace(/\/$/, '');
  async function request(path, { method = 'GET', body, token } = {}) {
    if (!base) throw new Error('Content service is not connected yet.');
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    if (body && !(body instanceof FormData)) { headers['Content-Type'] = 'application/json'; body = JSON.stringify(body); }
    let response;
    try { response = await fetch(`${base}/api${path}`, { method, headers, body, signal: AbortSignal.timeout(90000), cache: 'no-store' }); }
    catch { throw new Error('Unable to reach the content service. Please wait a moment and try again.'); }
    if (response.status === 204) return null;
    let data;
    try { data = await response.json(); } catch { throw new Error('The content service is starting. Please try again shortly.'); }
    if (!response.ok) throw Object.assign(new Error(data.error || 'Request failed. Please try again.'), { status: response.status });
    return data;
  }
  function element(tag, className, text) { const el = document.createElement(tag); if (className) el.className = className; if (text !== undefined) el.textContent = text; return el; }
  function imageUrl(value) { try { const url = new URL(value); return url.protocol === 'https:' && url.hostname === 'res.cloudinary.com' ? url.href : ''; } catch { return ''; } }
  const date = value => new Date(value).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
  return { request, element, imageUrl, date, configured: Boolean(base) };
})();
