import http from 'node:http';

let captured = false;
let serverFound;
const serverReady = new Promise((resolve) => {
  serverFound = resolve;
});

// Vercel captures the server without invoking the listen callback during import.
http.Server.prototype.listen = function () {
  captured = true;
  serverFound();
  return this;
};

const loaded = Promise.all([import('../api/dist/main.js'), serverReady]).then(() => true);
const completed = await Promise.race([
  loaded,
  new Promise((resolve) => setTimeout(() => resolve(false), 1500)),
]);

if (!completed || !captured) {
  console.error('FAIL: Vercel could not import the entrypoint and capture the server.');
  process.exitCode = 1;
} else {
  console.log('PASS: Entrypoint imports successfully while Vercel captures listen().');
}
