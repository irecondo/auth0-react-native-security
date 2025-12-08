export interface UserInfo {
    [key: string]: any;
}

export type AppState =
    | 'initializing'
    | 'login'
    | 'passwordless'
    | 'onboarding_bio'
    | 'onboarding_pin'
    | 'lock_screen'
    | 'home'
    | 'profile'
    | 'security'
    | 'change_pin'
    | 'devices'
    | 'passkeys';

export type PasswordlessStep = 'email' | 'otp';
