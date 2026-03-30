fetch('https://education-bridge-vnjp.onrender.com/api/health')
  .then(r => r.json())
  .then(d => console.log('✓ Works:', d))
  .catch(e => console.error('✗ CORS Error:', e))