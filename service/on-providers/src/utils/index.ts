export function isString(value: any): value is string {
  return typeof value === 'string' || value instanceof String;
}

export function isNumber(value: any): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean';
}
