import { AUTH0_DOMAIN } from '@env';

// My Account endpoints must use the same domain that issued the user token (custom domain)
const MY_ACCOUNT_DOMAIN = AUTH0_DOMAIN;

export const getMyAccountPasskeys = async (accessToken: string): Promise<any[]> => {
    if (!accessToken) return [];

    // Normalize tokens in case they already include a "Bearer " prefix
    const token = accessToken.replace(/^Bearer\s+/i, '').trim();
    if (!token) return [];

    try {
        console.log(`[MyAccountAPI] Fetching passkeys using domain ${MY_ACCOUNT_DOMAIN} with token prefix ${token.substring(0, 10)}...`);
        const response = await fetch(`https://${MY_ACCOUNT_DOMAIN}/me/v1/authentication-methods`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`[MyAccountAPI] Failed to fetch passkeys. Status ${response.status}: ${errorBody}`);
        }

        const methods = await response.json();
        const passkeys = methods.filter((m: any) => m.type === 'passkey');
        console.log(`[MyAccountAPI] Retrieved ${passkeys.length} passkeys from native API.`);
        return passkeys;
    } catch (error) {
        console.error('Error fetching native passkeys:', error);
        return [];
    }
};
