import * as Keychain from 'react-native-keychain';

export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'auth0_access_token',
    USER_INFO: 'auth0_user_info',
    PIN: 'app_pin',
    BIOMETRICS_ENABLED: 'biometrics_enabled',
    ONBOARDING_COMPLETE: 'onboarding_complete',
    IS_EMAIL_OTP_USER: 'is_email_otp_user',
    AUTO_LOCK_ENABLED: 'auto_lock_enabled',
    AUTO_LOCK_TIMEOUT_MINUTES: 'auto_lock_timeout_minutes',
};

export const setSecureValue = async (key: string, value: string) => {
    try {
        await Keychain.setGenericPassword(key, value, { service: key });
    } catch (error) {
        console.log('Error storing value:', error);
    }
};

export const getSecureValue = async (key: string): Promise<string | null> => {
    try {
        const result = await Keychain.getGenericPassword({ service: key });
        return result ? result.password : null;
    } catch (error) {
        console.log('Error retrieving value:', error);
        return null;
    }
};

export const clearSecureValue = async (key: string) => {
    try {
        await Keychain.resetGenericPassword({ service: key });
    } catch (error) {
        console.log('Error clearing value:', error);
    }
};
