const https = require('https');

exports.handler = async (event, context) => {
  const type = event.queryStringParameters?.type || 'success';
  
  console.log('📥 Payment redirect received');
  console.log('Type:', type);
  console.log('Method:', event.httpMethod);
  
  let txnid = '';
  
  // If POST request with payment data, forward to backend
  if (event.httpMethod === 'POST' && event.body) {
    try {
      console.log('📦 Payment data received, forwarding to backend...');
      
      // Extract txnid and status for redirect
      const formData = new URLSearchParams(event.body);
      txnid = formData.get('txnid') || '';
      const status = formData.get('status') || '';
      
      // Forward to backend using native https
      await forwardToBackend(event.body);
      
      // Check payment status
      if (status !== 'success') {
        const failureUrl = `/payment-failure.html?gateway=payu&txnid=${txnid}&status=${status}`;
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'text/html' },
          body: `<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="refresh" content="0;url=${failureUrl}">
  <script>window.location.href="${failureUrl}";</script>
</head>
<body>
  <p>Payment was not successful. Redirecting...</p>
</body>
</html>`
        };
      }
      
    } catch (error) {
      console.error('❌ Error forwarding to backend:', error);
    }
  }
  
  // Redirect to success page
  const targetPage = type === 'failure' ? 'payment-failure.html' : 'payment-success.html';
  let redirectUrl = `/${targetPage}?gateway=payu`;
  
  if (txnid) {
    redirectUrl += `&txnid=${txnid}`;
  }
  
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html' },
    body: `<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="refresh" content="0;url=${redirectUrl}">
  <script>window.location.href="${redirectUrl}";</script>
</head>
<body>
  <p>Payment processed successfully! Redirecting...</p>
</body>
</html>`
  };
};

// Helper function to forward data to backend
function forwardToBackend(body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'lexcello-backend.onrender.com',
      port: 443,
      path: '/api/payments/success',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log('✅ Backend response:', data);
        resolve(data);
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Backend request error:', error);
      reject(error);
    });
    
    req.write(body);
    req.end();
  });
}
