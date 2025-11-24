const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const type = event.queryStringParameters?.type || 'success';
  
  console.log('📥 Payment redirect received');
  console.log('Type:', type);
  console.log('Method:', event.httpMethod);
  
  let txnid = '';
  let paymentProcessed = false;
  
  // If POST request with payment data, forward to backend
  if (event.httpMethod === 'POST' && event.body) {
    try {
      console.log('📦 Payment data received, forwarding to backend...');
      
      // Forward the entire POST body to your backend
      const backendResponse = await fetch('https://lexcello-backend.onrender.com/api/payments/success', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: event.body
      });
      
      const result = await backendResponse.json();
      console.log('✅ Backend response:', result);
      paymentProcessed = true;
      
      // Extract txnid for redirect URL
      const formData = new URLSearchParams(event.body);
      txnid = formData.get('txnid') || '';
      
      // Check payment status from PayU response
      const status = formData.get('status') || '';
      if (status !== 'success') {
        // Payment failed, redirect to failure page
        const failureUrl = `/payment-failure.html?txnid=${txnid}&status=${status}`;
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
      // Still redirect user, but log the error
    }
  }
  
  // Determine target page
  const targetPage = type === 'failure' ? 'payment-failure.html' : 'payment-success.html';
  let redirectUrl = `/${targetPage}?gateway=payu`;
  
  if (txnid) {
    redirectUrl += `&txnid=${txnid}`;
  }
  
  // Return redirect HTML
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
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
