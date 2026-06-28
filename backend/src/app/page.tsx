export default function Home() {
  return (
    <main style={{ fontFamily: 'system-ui', padding: 24, maxWidth: 640 }}>
      <h1>Lumi API 🌙</h1>
      <p>Backend for the Lumi wellness app. Endpoints:</p>
      <ul>
        <li><code>POST /api/auth/signup</code></li>
        <li><code>POST /api/auth/login</code></li>
        <li><code>POST /api/auth/logout</code></li>
        <li><code>GET/POST /api/logs</code></li>
        <li><code>GET/PUT /api/profile</code></li>
        <li><code>POST /api/cycle/predict</code></li>
        <li><code>GET /api/partner</code></li>
        <li><code>GET /api/health</code></li>
      </ul>
    </main>
  );
}
