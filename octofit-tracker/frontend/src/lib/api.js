export function getApiBaseUrl() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();

  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev`;
  }

  return 'http://localhost:8000';
}

export function buildApiUrl(resourcePath) {
  const normalizedPath = resourcePath.startsWith('/') ? resourcePath : `/${resourcePath}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}

export async function fetchResource(resourcePath) {
  const response = await fetch(buildApiUrl(resourcePath));

  if (!response.ok) {
    throw new Error(`Unable to load ${resourcePath}`);
  }

  const payload = await response.json();

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return payload ? [payload] : [];
}
