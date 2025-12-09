import {
    AUTH0_DOMAIN,
    TENANT_AUTH0_DOMAIN,
    MGMT_CLIENT_ID,
    MGMT_CLIENT_SECRET,
    AUTH0_EMAIL_REALM,
    AUTH0_PASSKEY_REALM
} from '@env';

// Simple in-memory cache for the token
let managementToken: string | null = null;
let tokenExpiry: number = 0;

// Use the tenant domain if available, otherwise fallback (though user said to use tenant)
const MGMT_DOMAIN = TENANT_AUTH0_DOMAIN || AUTH0_DOMAIN;

export const getManagementToken = async (): Promise<string | null> => {
    // Check if valid token exists
    if (managementToken && Date.now() < tokenExpiry) {
        return managementToken;
    }

    try {
        const response = await fetch(`https://${MGMT_DOMAIN}/oauth/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_id: MGMT_CLIENT_ID,
                client_secret: MGMT_CLIENT_SECRET,
                audience: `https://${MGMT_DOMAIN}/api/v2/`,
                grant_type: 'client_credentials'
            })
        });

        const data = await response.json();

        if (response.ok && data.access_token) {
            managementToken = data.access_token;
            // Set expiry a bit earlier than actual (e.g. -60s) to be safe
            tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000;
            return managementToken;
        } else {
            console.error('Failed to get management token:', data);
            return null;
        }
    } catch (error) {
        console.error('Error fetching management token:', error);
        return null;
    }
};

export const getWebUserByEmail = async (
    email: string,
    realm: string = AUTH0_PASSKEY_REALM || AUTH0_EMAIL_REALM || 'email'
): Promise<any | null> => {
    const token = await getManagementToken();
    if (!token) return null;

    try {
        console.log(`[ManagementAPI] Searching for user by email: ${email}`);
        // Search by email
        const response = await fetch(`https://${MGMT_DOMAIN}/api/v2/users-by-email?email=${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.ok) {
            const users = await response.json();
            console.log(`[ManagementAPI] Found ${users.length} users with this email.`);

            // Filter for the user in the correct connection/realm
            const webUser = users.find((u: any) => {
                const hasConnection = u.identities.some((id: any) => id.connection === realm);
                return hasConnection;
            });

            if (webUser) {
                console.log(`[ManagementAPI] Found matching web user: ${webUser.user_id}`);
            } else {
                console.log(`[ManagementAPI] No user found with connection ${realm}. Available connections:`,
                    users.map((u: any) => u.identities.map((i: any) => i.connection)).flat()
                );
            }
            return webUser || null;
        }
        return null;
    } catch (error) {
        console.error('Error fetching web user:', error);
        return null;
    }
};

export const getUserPasskeys = async (userId: string): Promise<any[]> => {
    const token = await getManagementToken();
    if (!token) return [];

    try {
        console.log(`[ManagementAPI] Fetching passkeys for user: ${userId}`);
        const response = await fetch(`https://${MGMT_DOMAIN}/api/v2/users/${userId}/authentication-methods`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.ok) {
            const methods = await response.json();
            console.log(`[ManagementAPI] Raw authentication methods:`, JSON.stringify(methods, null, 2));

            const passkeys = methods.filter((m: any) => m.type === 'webauthn-platform' || m.type === 'webauthn-roaming');
            console.log(`[ManagementAPI] Filtered passkeys count: ${passkeys.length}`);
            return passkeys;
        }
        return [];
    } catch (error) {
        console.error('Error fetching passkeys:', error);
        return [];
    }
};

export const deleteUserPasskey = async (userId: string, passkeyId: string): Promise<boolean> => {
    const token = await getManagementToken();
    if (!token) return false;

    try {
        const response = await fetch(`https://${MGMT_DOMAIN}/api/v2/users/${userId}/authentication-methods/${passkeyId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.ok;
    } catch (error) {
        console.error('Error deleting passkey:', error);
        return false;
    }
};
