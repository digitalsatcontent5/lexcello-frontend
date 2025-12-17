/**
 * Lexcello Cookie Consent
 * Add this single line before </body> on any page:
 * <script src="cookie-consent.js"></script>
 */

(function() {
    'use strict';
    
    const GA_ID = 'G-6EV4Y6N8M5';
    
    // Inject CSS
    const styles = `
        .cookie-banner {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #1a202c;
            color: white;
            padding: 20px;
            z-index: 10000;
            box-shadow: 0 -4px 20px rgba(0,0,0,0.15);
            display: none;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .cookie-banner.show {
            display: block;
        }
        .cookie-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            flex-wrap: wrap;
        }
        .cookie-text {
            flex: 1;
            min-width: 300px;
        }
        .cookie-text p {
            margin: 0;
            font-size: 0.95rem;
            line-height: 1.5;
        }
        .cookie-text a {
            color: #d69e2e;
            text-decoration: underline;
        }
        .cookie-buttons {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        .cookie-btn {
            padding: 10px 24px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 0.9rem;
            cursor: pointer;
            border: none;
            transition: all 0.3s ease;
        }
        .cookie-btn-accept {
            background: #2b6cb0;
            color: white;
        }
        .cookie-btn-accept:hover {
            background: #2d4a66;
        }
        .cookie-btn-decline {
            background: transparent;
            color: white;
            border: 1px solid #4a5568;
        }
        .cookie-btn-decline:hover {
            background: #2d3748;
        }
        @media (max-width: 576px) {
            .cookie-content {
                flex-direction: column;
                text-align: center;
            }
            .cookie-buttons {
                width: 100%;
                justify-content: center;
            }
        }
    `;
    
    // Inject banner HTML
    const bannerHTML = `
        <div id="cookieBanner" class="cookie-banner">
            <div class="cookie-content">
                <div class="cookie-text">
                    <p>We use cookies to improve your experience and analyse site traffic. By clicking "Accept", you consent to our use of cookies. See our <a href="privacy-policy.html">Privacy Policy</a> for details.</p>
                </div>
                <div class="cookie-buttons">
                    <button class="cookie-btn cookie-btn-decline" id="cookieDecline">Decline</button>
                    <button class="cookie-btn cookie-btn-accept" id="cookieAccept">Accept</button>
                </div>
            </div>
        </div>
    `;
    
    // Load Google Analytics
    function loadGA() {
        if (window.gaLoaded) return;
        window.gaLoaded = true;
        
        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(script);
        
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', GA_ID);
    }
    
    // Handle consent choice
    function handleConsent(choice) {
        localStorage.setItem('cookieConsent', choice);
        document.getElementById('cookieBanner').classList.remove('show');
        
        if (choice === 'accepted') {
            loadGA();
        }
    }
    
    // Initialize
    function init() {
        // Add styles
        var styleEl = document.createElement('style');
        styleEl.textContent = styles;
        document.head.appendChild(styleEl);
        
        // Add banner
        var bannerContainer = document.createElement('div');
        bannerContainer.innerHTML = bannerHTML;
        document.body.appendChild(bannerContainer.firstElementChild);
        
        // Add event listeners
        document.getElementById('cookieAccept').addEventListener('click', function() {
            handleConsent('accepted');
        });
        document.getElementById('cookieDecline').addEventListener('click', function() {
            handleConsent('declined');
        });
        
        // Check existing consent
        var consent = localStorage.getItem('cookieConsent');
        
        if (consent === 'accepted') {
            // Already accepted, load GA
            loadGA();
        } else if (!consent) {
            // No choice yet, show banner
            document.getElementById('cookieBanner').classList.add('show');
        }
        // If declined, do nothing (no GA, no banner)
    }
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
