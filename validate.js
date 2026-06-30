// validate.js - GitHub Pages ke liye JS version
// URL: https://lastbgmi346-lgtm.github.io/Rootp4nel/validate.js

function validateKey(key) {
    return new Promise((resolve, reject) => {
        try {
            // LocalStorage se keys load karein
            const keysData = localStorage.getItem('nexo_keys_data');
            if (!keysData) {
                resolve({ valid: false, reason: 'No keys found' });
                return;
            }
            
            const keys = JSON.parse(keysData);
            const found = keys.find(k => k.key === key);
            
            if (!found) {
                resolve({ valid: false, reason: 'Key not found' });
                return;
            }
            
            if (found.status === 'used') {
                resolve({ valid: false, reason: 'Key already used' });
                return;
            }
            
            const now = new Date();
            const expires = new Date(found.expires);
            
            if (now > expires) {
                found.status = 'expired';
                localStorage.setItem('nexo_keys_data', JSON.stringify(keys));
                resolve({ valid: false, reason: 'Key expired' });
                return;
            }
            
            // ✅ Key valid hai!
            resolve({
                valid: true,
                key: found.key,
                duration: found.duration,
                expires: found.expires,
                days_left: Math.ceil((expires - now) / (1000 * 60 * 60 * 24))
            });
            
        } catch (e) {
            reject(e);
        }
    });
}

// 🔥 For direct URL access (GET parameter support)
// URL: validate.html?key=NEXO-XXXXX
if (typeof window !== 'undefined' && window.location.search) {
    const params = new URLSearchParams(window.location.search);
    const key = params.get('key');
    if (key) {
        validateKey(key).then(result => {
            document.body.innerHTML = `<pre>${JSON.stringify(result, null, 2)}</pre>`;
        });
    }
}
