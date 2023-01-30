export function appendQuery(url: string, key: string, value: string) {
  if (url.indexOf('?') >= 0) {
    return `${url}&${key}=${encodeURIComponent(value)}`;
  } else {
    return `${url}?${key}=${encodeURIComponent(value)}`;
  }
}
