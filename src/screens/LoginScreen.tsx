import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/AppStyles';
import { UserInfo } from '../types';

interface LoginScreenProps {
    userInfo: UserInfo | null;
    onUniversalLogin: () => void;
    onUniversalSignUp: () => void;
    onEmailOtpLogin: () => void;
    onSignUpFlow: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
    userInfo,
    onUniversalLogin,
    onUniversalSignUp,
    onEmailOtpLogin,
    onSignUpFlow
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Auth0Sample - Login</Text>
            <Text style={styles.statusText}>
                {userInfo ? `Logged in as ${userInfo.name || userInfo.email || 'User'}` : 'You are not logged in.'}
            </Text>
            <TouchableOpacity
                style={styles.universalLoginButton}
                onPress={onUniversalLogin}
            >
                <Text style={styles.universalLoginButtonText}>Log In with Email (Universal Login)</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.signUpLink}
                onPress={onUniversalSignUp}
            >
                <Text style={styles.signUpLinkText}>Sign Up with Universal Login</Text>
            </TouchableOpacity>
            <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
            </View>
            <TouchableOpacity
                style={styles.otpButton}
                onPress={onEmailOtpLogin}
            >
                <Text style={styles.otpButtonText}>Log In with Email OTP</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.signUpLink}
                onPress={onSignUpFlow}
            >
                <Text style={styles.signUpLinkText}>Sign Up with Email OTP</Text>
            </TouchableOpacity>
        </View>
    );
};
