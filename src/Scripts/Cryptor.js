


export const Key = {
  get: () => localStorage.getItem('authkey'),
  set: (value) => localStorage.setItem('authkey', value),
};
export async function encrypt(plaintext, password) {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv   = crypto.getRandomValues(new Uint8Array(12));

  // Derive key from password
  const baseKey = await crypto.subtle.importKey(
    "raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveKey"]
  );
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );

  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(plaintext))
  );

  // pack salt + iv + ciphertext
  const full = new Uint8Array(salt.length + iv.length + ciphertext.length);
  full.set(salt, 0);
  full.set(iv, salt.length);
  full.set(ciphertext, salt.length + iv.length);

  return btoa(String.fromCharCode(...full));
}

export async function decrypt(base64, password) {
  const data = new Uint8Array([...atob(base64)].map(c => c.charCodeAt(0)));
  const salt = data.slice(0, 16);
  const iv   = data.slice(16, 28);
  const ciphertext = data.slice(28);

  const enc = new TextEncoder();
  const dec = new TextDecoder();

  const baseKey = await crypto.subtle.importKey(
    "raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveKey"]
  );
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );

  const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
  return dec.decode(plaintext);
}