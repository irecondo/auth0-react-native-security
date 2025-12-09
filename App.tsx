/**
 * Sample React Native App with Auth0 + Biometrics + PIN
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import {
    ActivityIndicator,
    Alert,
    View,
    Text,
    Modal
} from 'react-native';
import Auth0 from 'react-native-auth0';
import { Passkey } from 'react-native-passkey';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import DeviceInfo from 'react-native-device-info';

// Imports from new structure
import { AUTH0_MYACCOUNT_AUDIENCE, AUTH0_PASSKEY_REALM } from '@env';


import { deleteUserPasskey } from './src/services/ManagementAPI';
import { getMyAccountPasskeys } from './src/services/MyAccountAPI';
import { startNativePasskeyRegistration, completeNativePasskeyRegistration } from './src/services/NativePasskeyAPI';
import config from './src/auth0-configuration';
import { styles } from './src/styles/AppStyles';
import { STORAGE_KEYS, setSecureValue, getSecureValue, clearSecureValue } from './src/utils/storage';
import { AppState, PasswordlessStep, UserInfo } from './src/types';

// Screens
import { LoadingScreen } from './src/screens/LoadingScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { PasswordlessScreen } from './src/screens/PasswordlessScreen';
import { OnboardingBioScreen } from './src/screens/OnboardingBioScreen';
import { OnboardingPinScreen } from './src/screens/OnboardingPinScreen';
import { LockScreen } from './src/screens/LockScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SecurityScreen } from './src/screens/SecurityScreen';
import { ChangePinScreen } from './src/screens/ChangePinScreen';
import { DevicesScreen } from './src/screens/DevicesScreen';
import { PasskeysScreen } from './src/screens/PasskeysScreen';

const auth0 = new Auth0(config);

const App = () => {
    const useEphemeralSession = true;
    const myAccountAudience = AUTH0_MYACCOUNT_AUDIENCE?.trim();

    // Core auth state
    const [appState, setAppState] = useState<AppState>('initializing');
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEmailOtpUser, setIsEmailOtpUser] = useState<boolean>(false);

    // Email OTP state
    const [passwordlessStep, setPasswordlessStep] = useState<PasswordlessStep>('email');
    const [email, setEmail] = useState<string>('');
    const [otp, setOtp] = useState<string>('');
    const [isSignUpFlow, setIsSignUpFlow] = useState<boolean>(false); // true = signup (with onboarding), false = login (no onboarding)

    // Onboarding/Security state
    const [biometricsAvailable, setBiometricsAvailable] = useState<boolean>(false);
    const [biometryType, setBiometryType] = useState<string | null>(null);
    const [biometricsEnabled, setBiometricsEnabled] = useState<boolean>(false);
    const [pinInput, setPinInput] = useState<string>('');
    const [confirmPinInput, setConfirmPinInput] = useState<string>('');
    const [isPinConfirmStep, setIsPinConfirmStep] = useState<boolean>(false);
    const [storedPin, setStoredPin] = useState<string | null>(null);
    const [deviceModel, setDeviceModel] = useState('Unknown Device');
    const [passkeys, setPasskeys] = useState<any[]>([]);
    const [isCreatingPasskey, setIsCreatingPasskey] = useState<boolean>(false);

    // Initialize app - check for stored credentials
    useEffect(() => {
        const initializeApp = async () => {
            try {
                // Check for biometrics support
                const rnBiometrics = new ReactNativeBiometrics();
                const { available, biometryType: bioType } = await rnBiometrics.isSensorAvailable();

                if (available && bioType) {
                    setBiometricsAvailable(true);
                    setBiometryType(bioType);
                }

                // Get Device Info
                const manufacturer = await DeviceInfo.getManufacturer();
                const model = DeviceInfo.getModel();
                setDeviceModel(`${manufacturer}, ${model}`);

                // Check for stored credentials
                const storedToken = await getSecureValue(STORAGE_KEYS.ACCESS_TOKEN);
                const storedUserInfo = await getSecureValue(STORAGE_KEYS.USER_INFO);
                const pin = await getSecureValue(STORAGE_KEYS.PIN);
                const bioEnabled = await getSecureValue(STORAGE_KEYS.BIOMETRICS_ENABLED);
                const storedOtpFlag = await getSecureValue(STORAGE_KEYS.IS_EMAIL_OTP_USER);

                if (storedToken && storedUserInfo) {
                    setAccessToken(storedToken);
                    setUserInfo(JSON.parse(storedUserInfo));
                    setStoredPin(pin);
                    setBiometricsEnabled(bioEnabled === 'true');
                    setIsEmailOtpUser(storedOtpFlag === 'true');

                    if (pin) {
                        // User has PIN set up - show lock screen
                        setAppState('lock_screen');

                        // Try biometrics first if enabled
                        if (bioEnabled === 'true' && available) {
                            rnBiometrics.simplePrompt({ promptMessage: 'Confirm identity' })
                                .then((resultObject) => {
                                    const { success } = resultObject;
                                    if (success) {
                                        setAppState('home');
                                    }
                                })
                                .catch(() => {
                                    console.log('Biometrics failed');
                                });
                        }
                    } else {
                        // No PIN - go directly to home
                        setAppState('home');
                    }
                } else {
                    setAppState('login');
                }
            } catch (error) {
                console.log('Init error:', error);
                setAppState('login');
            }
        };

        initializeApp();
    }, []);

    // Perform Universal Login (internal function)
    const performUniversalLogin = async (options?: { screenHint?: string; skipOnboarding?: boolean }) => {
        const { screenHint, skipOnboarding } = options || {};
        try {
            // Build authorize params
            const authorizeParams: any = {
                scope: 'openid profile email offline_access myaccount:read read:current_user update:current_user_identities',
            };
            if (myAccountAudience) {
                authorizeParams.audience = myAccountAudience;
            }

            // Pass screen_hint inside additionalParameters in the first argument (signup)
            if (screenHint) {
                authorizeParams.additionalParameters = { screen_hint: screenHint };
            }

            const credentials = await auth0.webAuth.authorize(
                authorizeParams,
                { ephemeralSession: useEphemeralSession }
            );
            setAccessToken(credentials.accessToken);

            const user = await auth0.auth.userInfo({ token: credentials.accessToken });
            setUserInfo(user);

            // Store credentials
            await setSecureValue(STORAGE_KEYS.ACCESS_TOKEN, credentials.accessToken);
            await setSecureValue(STORAGE_KEYS.USER_INFO, JSON.stringify(user));
            await setSecureValue(STORAGE_KEYS.IS_EMAIL_OTP_USER, 'false');
            setIsEmailOtpUser(false);

            // Check if user has already onboarded on this device (has PIN)
            const hasPin = await getSecureValue(STORAGE_KEYS.PIN);

            if (hasPin) {
                // Already onboarded on this device
                setAppState('home');
            } else if (!skipOnboarding) {
                // New user or new device - start onboarding flow (Bio -> PIN)
                setAppState('onboarding_bio');
            } else {
                // Login flow: skip onboarding
                setAppState('home');
            }
        } catch (error) {
            console.log('Login error:', error);
        }
    };

    // Universal Login with session check
    const onUniversalLogin = async () => {
        try {
            // Check for stored session first
            const storedToken = await getSecureValue(STORAGE_KEYS.ACCESS_TOKEN);
            const storedUserInfo = await getSecureValue(STORAGE_KEYS.USER_INFO);
            const pin = await getSecureValue(STORAGE_KEYS.PIN);
            const bioEnabled = await getSecureValue(STORAGE_KEYS.BIOMETRICS_ENABLED);

            if (storedToken && storedUserInfo) {
                // Session exists - restore state and navigate appropriately
                setAccessToken(storedToken);
                setUserInfo(JSON.parse(storedUserInfo));
                setStoredPin(pin);
                setBiometricsEnabled(bioEnabled === 'true');

                if (pin) {
                    // User has PIN set up - show lock screen
                    setAppState('lock_screen');
                    // Try biometrics first if enabled
                    if (bioEnabled === 'true' && biometricsAvailable) {
                        attemptBiometricAuth();
                    }
                } else {
                    // No PIN - go directly to home
                    setAppState('home');
                }
            } else {
                // No session - proceed with Universal Login
                await performUniversalLogin({ skipOnboarding: true });
            }
        } catch (error) {
            console.log('Session check error:', error);
            // Error checking session - proceed with Universal Login
            await performUniversalLogin({ skipOnboarding: true });
        }
    };

    // Universal Login - Sign Up (goes directly to signup screen)
    const onUniversalSignUp = async () => {
        await performUniversalLogin({ screenHint: 'signup' });
    };

    // Check for existing session before Email OTP login
    const onEmailOtpLogin = async () => {
        try {
            // Check for stored session
            const storedToken = await getSecureValue(STORAGE_KEYS.ACCESS_TOKEN);
            const storedUserInfo = await getSecureValue(STORAGE_KEYS.USER_INFO);
            const pin = await getSecureValue(STORAGE_KEYS.PIN);
            const bioEnabled = await getSecureValue(STORAGE_KEYS.BIOMETRICS_ENABLED);

            if (storedToken && storedUserInfo) {
                // Session exists - restore state and navigate appropriately
                setAccessToken(storedToken);
                setUserInfo(JSON.parse(storedUserInfo));
                setStoredPin(pin);
                setBiometricsEnabled(bioEnabled === 'true');

                if (pin) {
                    // User has PIN set up - show lock screen
                    setAppState('lock_screen');
                    // Try biometrics first if enabled
                    if (bioEnabled === 'true' && biometricsAvailable) {
                        attemptBiometricAuth();
                    }
                } else {
                    // No PIN - go directly to home
                    setAppState('home');
                }
            } else {
                // No session - start Email OTP flow
                setIsSignUpFlow(false);
                setAppState('passwordless');
            }
        } catch (error) {
            console.log('Session check error:', error);
            // Error checking session - start Email OTP flow
            setIsSignUpFlow(false);
            setAppState('passwordless');
        }
    };

    // Email OTP flow
    const onSendOtp = async () => {
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        setIsLoading(true);
        try {
            await auth0.auth.passwordlessWithEmail({
                email: email.trim(),
                send: 'code',
                realm: AUTH0_PASSKEY_REALM
            });
            setPasswordlessStep('otp');
            Alert.alert('Success', 'A verification code has been sent to your email');
        } catch (error: any) {
            console.log('Send OTP error:', error);
            Alert.alert('Error', error.message || 'Failed to send verification code.');
        } finally {
            setIsLoading(false);
        }
    };

    const onVerifyOtp = async () => {
        if (!otp.trim()) {
            Alert.alert('Error', 'Please enter the verification code');
            return;
        }

        if (!email.trim()) {
            Alert.alert('Error', 'Email address is missing. Please go back and enter your email again.');
            return;
        }

        setIsLoading(true);
        try {
            const credentials = await auth0.auth.loginWithEmail({
                email: email.trim(),
                code: otp.trim(),
                scope: 'openid profile email',
                realm: AUTH0_PASSKEY_REALM
            });

            setAccessToken(credentials.accessToken);
            const user = await auth0.auth.userInfo({ token: credentials.accessToken });
            setUserInfo(user);

            // Store credentials
            await setSecureValue(STORAGE_KEYS.ACCESS_TOKEN, credentials.accessToken);
            await setSecureValue(STORAGE_KEYS.USER_INFO, JSON.stringify(user));
            await setSecureValue(STORAGE_KEYS.IS_EMAIL_OTP_USER, 'true');
            setIsEmailOtpUser(true);

            // Reset passwordless state
            setEmail('');
            setOtp('');
            setPasswordlessStep('email');

            // Navigate based on signup vs login flow
            if (isSignUpFlow) {
                // Signup flow: go to onboarding (Face ID + PIN setup)
                setIsSignUpFlow(false);
                setAppState('onboarding_bio');
            } else {
                // Login flow: go directly to home (no onboarding)
                setAppState('home');
            }
        } catch (error: any) {
            console.log('Verify OTP error:', error);
            Alert.alert('Error', error.message || 'Invalid verification code.');
        } finally {
            setIsLoading(false);
        }
    };

    // Get biometrics icon/text
    const getBiometricsLabel = () => {
        switch (biometryType) {
            case BiometryTypes.FaceID:
                return 'Face ID';
            case BiometryTypes.TouchID:
                return 'Touch ID';
            case BiometryTypes.Biometrics:
                return 'Biometrics';
            default:
                return 'Biometrics';
        }
    };

    // Biometrics setup
    const enableBiometrics = async () => {
        try {
            const rnBiometrics = new ReactNativeBiometrics();
            const { success } = await rnBiometrics.simplePrompt({
                promptMessage: 'Confirm your identity',
            });
            if (success) {
                await setSecureValue(STORAGE_KEYS.BIOMETRICS_ENABLED, 'true');
                setBiometricsEnabled(true);
                Alert.alert('Success', `${biometryType} has been enabled!`);
                setAppState('onboarding_pin');
            }
        } catch (error) {
            console.log('Biometrics error:', error);
            Alert.alert('Error', 'Failed to enable biometrics. Please try again.');
        }
    };

    const skipBiometrics = () => {
        setAppState('onboarding_pin');
    };

    // Toggle biometrics from security settings
    const toggleBiometrics = async () => {
        if (biometricsEnabled) {
            // Disable biometrics
            Alert.alert(
                'Disable ' + getBiometricsLabel(),
                `Are you sure you want to disable ${getBiometricsLabel()}?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Disable',
                        style: 'destructive',
                        onPress: async () => {
                            await setSecureValue(STORAGE_KEYS.BIOMETRICS_ENABLED, 'false');
                            setBiometricsEnabled(false);
                            Alert.alert('Success', `${getBiometricsLabel()} has been disabled.`);
                        }
                    }
                ]
            );
        } else {
            // Enable biometrics
            if (!biometricsAvailable) {
                Alert.alert('Not Available', `${getBiometricsLabel()} is not available on this device.`);
                return;
            }
            try {
                const rnBiometrics = new ReactNativeBiometrics();
                const { success } = await rnBiometrics.simplePrompt({
                    promptMessage: 'Confirm your identity to enable ' + getBiometricsLabel(),
                });
                if (success) {
                    await setSecureValue(STORAGE_KEYS.BIOMETRICS_ENABLED, 'true');
                    setBiometricsEnabled(true);
                    Alert.alert('Success', `${getBiometricsLabel()} has been enabled!`);
                }
            } catch (error) {
                console.log('Biometrics error:', error);
                Alert.alert('Error', 'Failed to enable biometrics. Please try again.');
            }
        }
    };

    // Open PIN change screen
    const openChangePinScreen = () => {
        setPinInput('');
        setConfirmPinInput('');
        setIsPinConfirmStep(false);
        setAppState('change_pin');
    };

    // PIN setup
    const onPinDigitPress = (digit: string) => {
        if (isPinConfirmStep) {
            if (confirmPinInput.length < 6) {
                setConfirmPinInput(prev => prev + digit);
            }
        } else {
            if (pinInput.length < 6) {
                setPinInput(prev => prev + digit);
            }
        }
    };

    const onPinDelete = () => {
        if (isPinConfirmStep) {
            setConfirmPinInput(prev => prev.slice(0, -1));
        } else {
            setPinInput(prev => prev.slice(0, -1));
        }
    };

    useEffect(() => {
        const isPinScreen = appState === 'onboarding_pin' || appState === 'change_pin';

        if (isPinScreen && pinInput.length === 6 && !isPinConfirmStep) {
            // First PIN entry complete, move to confirmation
            setTimeout(() => {
                setIsPinConfirmStep(true);
            }, 200);
        } else if (isPinScreen && confirmPinInput.length === 6 && isPinConfirmStep) {
            // Confirmation complete, verify match
            if (pinInput === confirmPinInput) {
                savePinAndComplete();
            } else {
                Alert.alert('Error', 'PINs do not match. Please try again.');
                setPinInput('');
                setConfirmPinInput('');
                setIsPinConfirmStep(false);
            }
        }
    }, [pinInput, confirmPinInput, isPinConfirmStep, appState]);

    const savePinAndComplete = async () => {
        try {
            await setSecureValue(STORAGE_KEYS.PIN, pinInput);
            await setSecureValue(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
            setStoredPin(pinInput);
            setPinInput('');
            setConfirmPinInput('');
            setIsPinConfirmStep(false);

            // Navigate based on where we came from
            if (appState === 'change_pin') {
                Alert.alert('Success', 'Your PIN has been updated.');
                setAppState('security');
            } else {
                setAppState('home');
            }
        } catch (error) {
            console.log('Error saving PIN:', error);
            Alert.alert('Error', 'Failed to save PIN. Please try again.');
        }
    };

    // Lock screen authentication
    const attemptBiometricAuth = async () => {
        try {
            const rnBiometrics = new ReactNativeBiometrics();
            const { success } = await rnBiometrics.simplePrompt({
                promptMessage: 'Authenticate to access the app',
            });
            if (success) {
                setAppState('home');
            }
        } catch (error) {
            console.log('Biometric auth failed:', error);
            // User will need to use PIN
        }
    };

    const [lockPinInput, setLockPinInput] = useState<string>('');

    const onLockPinDigitPress = (digit: string) => {
        if (lockPinInput.length < 6) {
            const newPin = lockPinInput + digit;
            setLockPinInput(newPin);

            if (newPin.length === 6) {
                // Verify PIN
                setTimeout(() => {
                    if (newPin === storedPin) {
                        setLockPinInput('');
                        setAppState('home');
                    } else {
                        Alert.alert('Error', 'Incorrect PIN. Please try again.');
                        setLockPinInput('');
                    }
                }, 200);
            }
        }
    };

    const onLockPinDelete = () => {
        setLockPinInput(prev => prev.slice(0, -1));
    };

    // Logout
    const onLogout = async () => {
        // Clear all stored data
        await clearSecureValue(STORAGE_KEYS.ACCESS_TOKEN);
        await clearSecureValue(STORAGE_KEYS.USER_INFO);
        await clearSecureValue(STORAGE_KEYS.PIN);
        await clearSecureValue(STORAGE_KEYS.BIOMETRICS_ENABLED);
        await clearSecureValue(STORAGE_KEYS.ONBOARDING_COMPLETE);
        await clearSecureValue(STORAGE_KEYS.IS_EMAIL_OTP_USER);

        setAccessToken(null);
        setUserInfo(null);
        setStoredPin(null);
        setBiometricsEnabled(false);
        setIsEmailOtpUser(false);
        setAppState('login');
    };

    // Passkeys Logic
    const [webUserId, setWebUserId] = useState<string | null>(null);

    useEffect(() => {
        if (appState === 'passkeys') {
            fetchWebUserAndPasskeys();
        }
    }, [appState]);

    const fetchWebUserAndPasskeys = async () => {
        if (!accessToken) {
            Alert.alert('Error', 'Missing access token. Please log in again.');
            return;
        }

        if (!userInfo?.sub) {
            Alert.alert('Error', 'User identifier is missing.');
            return;
        }

        if (isEmailOtpUser) {
            Alert.alert(
                'Passkeys Unavailable',
                'Passkeys require a session with My Account permissions. Please log out and sign in using Universal Login to view passkeys.'
            );
            return;
        }

        try {
            Alert.alert(
                'Passkey Debug',
                `Domain: ${config.domain}\nToken: ${accessToken.substring(0, 12)}...\nUser: ${userInfo.sub}`
            );

            const methods = await getMyAccountPasskeys(accessToken);
            setWebUserId(userInfo.sub);
            setPasskeys(methods);
            Alert.alert('Passkeys Loaded', `Fetched ${methods.length} passkeys from native API.`);
        } catch (error) {
            console.log('Error fetching native passkeys:', error);
            const message = error instanceof Error ? error.message : JSON.stringify(error);
            Alert.alert('Error', `Failed to load passkeys.\n${message}`);
        }
    };

    const deletePasskey = async (id: string) => {
        if (!webUserId) return;

        Alert.alert(
            'Delete Passkey',
            'Are you sure you want to delete this passkey from your web account?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const success = await deleteUserPasskey(webUserId, id);
                            if (success) {
                                fetchWebUserAndPasskeys();
                                Alert.alert('Success', 'Passkey deleted from web account');
                            } else {
                                Alert.alert('Error', 'Failed to delete passkey');
                            }
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete passkey');
                        }
                    }
                }
            ]
        );
    };

    const createPasskey = async () => {
        if (isCreatingPasskey) return;
        if (!accessToken || !userInfo?.sub) {
            Alert.alert('Error', 'Missing session. Please log in again.');
            return;
        }

        if (isEmailOtpUser) {
            Alert.alert(
                'Passkeys Unavailable',
                'Passkeys require a session with My Account permissions. Please log out and sign in using Universal Login to create a passkey.'
            );
            return;
        }

        setIsCreatingPasskey(true);
        try {
            const displayName = userInfo.name || userInfo.email || userInfo.sub;
            const challenge = await startNativePasskeyRegistration(accessToken, userInfo.sub, displayName);
            const credential = await Passkey.create(challenge.options);
            await completeNativePasskeyRegistration(accessToken, userInfo.sub, credential, challenge.transactionId);

            await fetchWebUserAndPasskeys();
            Alert.alert('Success', 'New passkey created.');
        } catch (error) {
            console.log('Error creating passkey:', error);
            const message = error instanceof Error ? error.message : 'Failed to create passkey.';
            Alert.alert('Error', message);
        } finally {
            setIsCreatingPasskey(false);
        }
    };

    // ==================== RENDER SCREENS ====================

    // Initializing
    if (appState === 'initializing') {
        return <LoadingScreen />;
    }

    // Lock Screen
    if (appState === 'lock_screen') {
        return (
            <LockScreen
                userInfo={userInfo}
                lockPinInput={lockPinInput}
                onLockPinDigitPress={onLockPinDigitPress}
                onLockPinDelete={onLockPinDelete}
                biometricsEnabled={biometricsEnabled}
                biometryType={biometryType}
                onBiometricAuth={attemptBiometricAuth}
            />
        );
    }

    // Onboarding: Biometrics
    if (appState === 'onboarding_bio') {
        return (
            <OnboardingBioScreen
                biometryType={biometryType}
                biometricsAvailable={biometricsAvailable}
                onEnable={enableBiometrics}
                onSkip={skipBiometrics}
            />
        );
    }

    // Onboarding: PIN Setup
    if (appState === 'onboarding_pin') {
        return (
            <OnboardingPinScreen
                pinInput={pinInput}
                confirmPinInput={confirmPinInput}
                isPinConfirmStep={isPinConfirmStep}
                onPinDigitPress={onPinDigitPress}
                onPinDelete={onPinDelete}
            />
        );
    }

    // Home Screen
    if (appState === 'home') {
        return (
            <HomeScreen
                userInfo={userInfo}
                onProfilePress={() => setAppState('profile')}
                onSecurityPress={() => setAppState('security')}
                onLogout={onLogout}
                onBackToLogin={() => setAppState('login')} // Keeping for debug/test
            />
        );
    }

    // Profile Screen
    if (appState === 'profile') {
        return (
            <ProfileScreen
                userInfo={userInfo!}
                onBack={() => setAppState('home')}
            />
        );
    }

    // Security Options Screen
    if (appState === 'security') {
        return (
            <SecurityScreen
                onBack={() => setAppState('home')}
                biometryType={biometryType}
                biometricsAvailable={biometricsAvailable}
                biometricsEnabled={biometricsEnabled}
                toggleBiometrics={toggleBiometrics}
                storedPin={storedPin}
                openChangePinScreen={openChangePinScreen}
                onDevicesPress={() => setAppState('devices')}
            />
        );
    }

    // Change PIN Screen
    if (appState === 'change_pin') {
        return (
            <ChangePinScreen
                onBack={() => setAppState('security')}
                isPinConfirmStep={isPinConfirmStep}
                pinInput={pinInput}
                confirmPinInput={confirmPinInput}
                onPinDigitPress={onPinDigitPress}
                onPinDelete={onPinDelete}
            />
        );
    }

    // Devices Screen
    if (appState === 'devices') {
        return (
            <DevicesScreen
                onBack={() => setAppState('security')}
                deviceModel={deviceModel}
            />
        );
    }

    // Passkeys Screen
    if (appState === 'passkeys') {
        return (
            <PasskeysScreen
                onBack={() => setAppState('security')}
                passkeys={passkeys}
                onCreatePasskey={createPasskey}
                onDeletePasskey={deletePasskey}
            />
        );
    }

    // Passwordless / Email OTP Screen
    if (appState === 'passwordless') {
        return (
            <PasswordlessScreen
                isSignUpFlow={isSignUpFlow}
                passwordlessStep={passwordlessStep}
                email={email}
                onEmailChange={setEmail}
                otp={otp}
                onOtpChange={setOtp}
                isLoading={isLoading}
                onSendOtp={onSendOtp}
                onVerifyOtp={onVerifyOtp}
                onBack={() => setAppState('login')}
            />
        );
    }

    // Default: Login Screen
    return (
        <LoginScreen
            userInfo={userInfo}
            onUniversalLogin={onUniversalLogin}
            onUniversalSignUp={onUniversalSignUp}
            onEmailOtpLogin={onEmailOtpLogin}
            onSignUpFlow={() => {
                setIsSignUpFlow(true);
                setAppState('passwordless');
            }}
        />
    );
};

export default App;
