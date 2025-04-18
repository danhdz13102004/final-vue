export function saveToken(token) {
  localStorage.setItem("auth_token", token || "");
}

export function getToken() {
  return localStorage.getItem("auth_token") || null;
}

export function parseToken(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return {};
  }
}
