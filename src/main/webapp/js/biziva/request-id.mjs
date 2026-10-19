// Derive an opaque, stable operation ID without persisting credentials or prompts.
// Identical paid requests reuse their ID across remounts, reloads and tabs.
// The API ledger remains authoritative; an ID is not a promise of a free result.
export async function generationRequestId(cryptoApi, key, payload, scope) {
  if (!cryptoApi?.subtle || typeof key !== 'string' || !key || !scope) {
    throw Error('Não foi possível identificar a geração com segurança.');
  }
  const bytes = new TextEncoder().encode(JSON.stringify(['biziva-operation-v2', scope, key, payload]));
  const digest = new Uint8Array(await cryptoApi.subtle.digest('SHA-256', bytes));
  digest[6] = (digest[6] & 15) | 64;
  digest[8] = (digest[8] & 63) | 128;
  const hex = Array.from(digest.slice(0, 16), n => n.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}
