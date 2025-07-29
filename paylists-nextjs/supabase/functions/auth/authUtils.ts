import { Buffer } from "node:buffer";

export function parseJwt(token: string) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const buff = Buffer.from(base64, "base64");
  const payloadinit = buff.toString("ascii");

  return JSON.parse(payloadinit);
}
