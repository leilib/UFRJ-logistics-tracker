// oauth.js
const CLIENT_ID = "4602042605636246";
const REDIRECT_URI = "https://leilib.github.io/UFRJ-logistics-tracker/callback";
const AUTH_URL = "https://auth.mercadolivre.com.br/authorization";

// Convert ArrayBuffer to base64url string
function base64url(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+/g, "");
}

// SHA-256 hash function for PKCE challenge
async function sha256(str) {
  const data = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return base64url(hash);
}

// Generate a random PKCE verifier string
function randomString(length = 64) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map(x => chars[x % chars.length])
    .join("");
}

document.getElementById("login").addEventListener("click", async () => {
  // ✅ Generate PKCE verifier and challenge
  const verifier = randomString();
  const challenge = await sha256(verifier);
  sessionStorage.setItem("pkce_verifier", verifier);

  // ✅ Generate secure state to prevent CSRF
  const state = crypto.randomUUID();
  sessionStorage.setItem("ml_oauth_state", state);

  // Build authorization URL with PKCE and state
  const params = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    code_challenge: challenge,
    code_challenge_method: "S256",
    state
  });

  // Redirect user to Mercado Livre login
  window.location.href = `${AUTH_URL}?${params.toString()}`;
});
