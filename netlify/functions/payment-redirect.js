exports.handler = async (event, context) => {
  // Get the path from the request
  const path = event.path;
  
  // If it's a POST to payment success/failure, redirect to GET
  if (event.httpMethod === 'POST') {
    // Extract any parameters from POST body
    let params = {};
    try {
      params = event.body ? JSON.parse(event.body) : {};
    } catch (e) {
      // If body is form-encoded, parse it differently
      if (event.body) {
        const formData = new URLSearchParams(event.body);
        params.txnid = formData.get('txnid') || '';
      }
    }
    
    const txnid = params.txnid || '';
    
    // Determine which page based on path
    let redirectUrl = '/payment-success.html';
    if (path.includes('failure')) {
      redirectUrl = '/payment-failure.html';
    }
    
    // Add transaction ID if present
    if (txnid) {
      redirectUrl += `?txnid=${txnid}`;
    }
    
    // Return HTML that redirects immediately
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta http-equiv="refresh" content="0;url=${redirectUrl}">
          <script>window.location.href="${redirectUrl}";</script>
        </head>
        <body>
          <p>Processing payment... Please wait.</p>
        </body>
        </html>
      `
    };
  }
  
  // For GET requests, just return 404
  return {
    statusCode: 404,
    body: 'Not found'
  };
};
