exports.handler = async (event, context) => {
  // Get type from query params
  const type = event.queryStringParameters?.type || 'success';
  
  // Extract txnid from POST body (if POST request)
  let txnid = '';
  if (event.httpMethod === 'POST' && event.body) {
    try {
      const formData = new URLSearchParams(event.body);
      txnid = formData.get('txnid') || '';
    } catch (e) {
      console.error('Error parsing body:', e);
    }
  }
  
  // Determine target page based on type
  const targetPage = type === 'failure' ? 'payment-failure.html' : 'payment-success.html';
  let redirectUrl = `/${targetPage}`;
  
  // Add transaction ID if present
  if (txnid) {
    redirectUrl += `?txnid=${txnid}`;
  }
  
  // Return redirect HTML (works for both GET and POST)
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
  <p>Processing payment... Please wait.</p>
</body>
</html>`
  };
};
