#!/usr/bin/env node
/*
 * Cifra el banco de soluciones para publicarlo en el sitio estático.
 *
 *   node scripts/encriptar-soluciones.mjs
 *
 * Lee la contraseña de .env (SOLUCIONES_PASSWORD) y las soluciones en texto
 * plano de privado/*.mjs (ambos ignorados por git). Escribe
 * js/soluciones.enc.js, que contiene SOLO el texto cifrado (AES-256-GCM con
 * clave derivada por PBKDF2-SHA256). Ese archivo sí se publica.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { webcrypto as crypto } from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const ITER = 600000;

function leerEnv() {
  let txt;
  try { txt = readFileSync(join(raiz, ".env"), "utf8"); }
  catch { throw new Error("Falta el archivo .env (copiá .env.example y completá SOLUCIONES_PASSWORD)."); }
  const env = {};
  for (const linea of txt.split(/\r?\n/)) {
    const m = linea.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  if (!env.SOLUCIONES_PASSWORD) throw new Error("SOLUCIONES_PASSWORD está vacío en .env");
  return env;
}

const b64 = (u8) => Buffer.from(u8).toString("base64");

async function main() {
  const { SOLUCIONES_PASSWORD: pass } = leerEnv();
  const dir = join(raiz, "privado");
  const archivos = readdirSync(dir).filter((f) => f.endsWith(".mjs")).sort();
  const sol = {};
  for (const f of archivos) Object.assign(sol, (await import(pathToFileURL(join(dir, f)).href)).default);

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(pass), "PBKDF2", false, ["deriveKey"]);
  const clave = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: ITER, hash: "SHA-256" },
    base, { name: "AES-GCM", length: 256 }, false, ["encrypt"]
  );
  const plano = new TextEncoder().encode(JSON.stringify({ v: 1, sol }));
  const cifrado = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, clave, plano));

  const out = `/* Banco de soluciones CIFRADO (AES-256-GCM, PBKDF2-SHA256 ${ITER} it.).
   Generado por scripts/encriptar-soluciones.mjs — no editar a mano. */
window.SOLUCIONES_ENC = ${JSON.stringify({ iter: ITER, salt: b64(salt), iv: b64(iv), data: b64(cifrado) })};
`;
  writeFileSync(join(raiz, "js", "soluciones.enc.js"), out);
  console.log(`OK: ${Object.keys(sol).length} soluciones cifradas → js/soluciones.enc.js (${(out.length / 1024).toFixed(0)} KB)`);
}

main().catch((e) => { console.error("Error:", e.message); process.exit(1); });
