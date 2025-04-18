// src/utils/jwt.js

import { jwtDecode } from "jwt-decode";

// Encode payload object → JWT-like string (base64)
export function encodeToken(payload) {
  const header = { alg: "none", typ: "JWT" };
  const base64Header = btoa(JSON.stringify(header));
  const base64Payload = btoa(JSON.stringify(payload));

  // Không có chữ ký → chỉ dùng để lưu trữ tạm
  return `${base64Header}.${base64Payload}.`;
}

// Decode token string → payload object
export function decodeToken(token) {
  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
}
