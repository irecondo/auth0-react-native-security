import { AUTH0_DOMAIN, AUTH0_PASSKEY_REALM, AUTH0_CLIENT_ID, TENANT_AUTH0_DOMAIN } from '@env';
import { PasskeyCreateRequest, PasskeyCreateResult } from 'react-native-passkey';

const PASSKEY_REALM = AUTH0_PASSKEY_REALM || 'Username-Password-Authentication';

const sanitizeToken = (token: string) => token.replace(/^Bearer\s+/i, '').trim();

const postJson = async (url: string, token: string, body: Record<string, any>) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    return response;
};

const getCandidateDomains = () => {
    // Native passkeys should be served from the custom domain. Only fall back to tenant if custom is missing.
    if (AUTH0_DOMAIN) {
        return [AUTH0_DOMAIN];
    }
    return [TENANT_AUTH0_DOMAIN].filter(Boolean) as string[];
};

export interface PasskeyRegistrationChallenge {
    options: PasskeyCreateRequest;
    transactionId?: string;
}

export const startNativePasskeyRegistration = async (
    accessToken: string,
    userId: string,
    displayName?: string
): Promise<PasskeyRegistrationChallenge> => {
    if (!accessToken) {
        throw new Error('Missing access token for passkey registration.');
    }
    const token = sanitizeToken(accessToken);

    const payload = {
        realm: PASSKEY_REALM,
        user_id: userId,
        display_name: displayName,
        user_display_name: displayName,
        client_id: AUTH0_CLIENT_ID
    };

    const candidatePaths = [
        '/passkey/challenge/registration',
        '/passkeys/challenge/registration'
    ];

    const candidateDomains = getCandidateDomains();

    let lastError: string | null = null;
    for (const domain of candidateDomains) {
        for (const path of candidatePaths) {
            const url = `https://${domain}${path}`;
            const response = await postJson(url, token, payload);

            if (response.ok) {
                const data = await response.json();
                const options = (data.publicKey ?? data.options ?? data.challenge ?? data) as PasskeyCreateRequest;

                if (!options?.challenge) {
                    throw new Error('[NativePasskeyAPI] Invalid registration challenge response.');
                }

                return {
                    options,
                    transactionId: data.transaction_id || data.transactionId || data.challenge_id
                };
            }

            const body = await response.text();
            lastError = `[NativePasskeyAPI] Challenge failed at ${url} (${response.status}): ${body}`;

            if (response.status !== 404) {
                throw new Error(lastError);
            }
        }
    }

    throw new Error(lastError || '[NativePasskeyAPI] Challenge failed with unknown error.');
};

export const completeNativePasskeyRegistration = async (
    accessToken: string,
    userId: string,
    credential: PasskeyCreateResult,
    transactionId?: string
): Promise<void> => {
    if (!accessToken) {
        throw new Error('Missing access token for passkey registration.');
    }
    const token = sanitizeToken(accessToken);

    const payload: Record<string, any> = {
        realm: PASSKEY_REALM,
        user_id: userId,
        credential,
        client_id: AUTH0_CLIENT_ID
    };

    if (transactionId) {
        payload.transaction_id = transactionId;
    }

    const candidatePaths = [
        '/passkey/registration',
        '/passkeys/registration'
    ];

    const candidateDomains = getCandidateDomains();

    let lastError: string | null = null;
    for (const domain of candidateDomains) {
        for (const path of candidatePaths) {
            const url = `https://${domain}${path}`;
            const response = await postJson(url, token, payload);

            if (response.ok) {
                return;
            }

            const body = await response.text();
            lastError = `[NativePasskeyAPI] Finalize failed at ${url} (${response.status}): ${body}`;

            if (response.status !== 404) {
                throw new Error(lastError);
            }
        }
    }

    throw new Error(lastError || '[NativePasskeyAPI] Finalize failed with unknown error.');
};
