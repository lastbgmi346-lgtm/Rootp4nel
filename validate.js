// validate.js - Pure JSON response
// URL: https://lastbgmi346-lgtm.github.io/Rootp4nel/validate.js?key=NEXO-XXXXX

(function() {
    const params = new URLSearchParams(window.location.search);
    const key = params.get('key');

    async function loadKeys() {
        try {
            const timestamp = Date.now();
            const response = await fetch('keys.json?t=' + timestamp);
            if (!response.ok) {
                throw new Error('keys.json not found');
            }
            const data = await response.json();
            if (!Array.isArray(data)) return [data];
            return data;
        } catch (e) {
            return null;
        }
    }

    async function validateKey(key) {
        const keys = await loadKeys();
        if (!keys) {
            return { valid: false, reason: 'Failed to load keys.json' };
        }

        const found = keys.find(k => k.key.toUpperCase() === key.toUpperCase());
        if (!found) {
            return { valid: false, reason: 'Key not found' };
        }

        if (found.status === 'used') {
            return { valid: false, reason: 'Key already used' };
        }

        const now = new Date();
        const expires = new Date(found.expires);
        
        if (now > expires) {
            return { valid: false, reason: 'Key expired' };
        }

        return {
            valid: true,
            key: found.key,
            duration: found.duration,
            expires: found.expires,
            days_left: Math.ceil((expires - now) / (1000 * 60 * 60 * 24))
        };
    }

    // 🔥 Main execution - Pure JSON output
    if (key) {
        validateKey(key).then(result => {
            document.body.textContent = JSON.stringify(result);
        }).catch(err => {
            document.body.textContent = JSON.stringify({ valid: false, reason: err.message });
        });
    } else {
        document.body.textContent = JSON.stringify({ valid: false, reason: 'No key provided' });
    }
})();
