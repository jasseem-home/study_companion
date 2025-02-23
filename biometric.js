// biometrics.js

// initialize biometric authentication
async function initializeBiometricLogin() {
    const loginButton = document.getElementById('loginBtn');

    loginButton.addEventListener('click', async () => {
        try {
            const available = await checkBiometricAvailability();
            if (available) {
                await startBiometricLogin();
            } else {
                alert('Biometric authentication is not available or supported.');
            }
        } catch (error) {
            console.error('Biometric login failed', error);
        }
    });
}

// Check if biometric authentication is available
async function checkBiometricAvailability() {
    if ('PublicKeyCredential' in window) {
        // Check if WebAuthn is supported by the browser
        try {
            const credentials = await navigator.credentials.get({ publicKey: {} });
            return credentials !== null;
        } catch (error) {
            console.log("Biometric authentication not available:", error);
            return false;
        }
    }
    return false;
}

//  start biometric authentication (using WebAuthn)
async function startBiometricLogin() {
    try {
        const credentialRequestOptions = {
            challenge: new Uint8Array([/* challenge data from server */]),
            rpId: 'example.com',
            allowCredentials: [
                {
                    type: 'public-key',
                    id: new Uint8Array([/* user credential ID */]),
                }
            ],
            userVerification: 'required',
        };

        // Requesting the user's biometric data for login
        const assertion = await navigator.credentials.get({
            publicKey: credentialRequestOptions
        });

        //authenticate user
        if (assertion) {
            console.log('Biometric authentication successful');
            alert('Login successful!');
            
        } else {
            alert('Biometric authentication failed!');
        }
    } catch (error) {
        console.error('Biometric authentication failed:', error);
    }
}

// biometric login functionality
initializeBiometricLogin();
