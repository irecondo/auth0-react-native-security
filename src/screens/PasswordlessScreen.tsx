import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { styles } from '../styles/AppStyles';
import { PasswordlessStep } from '../types';

interface PasswordlessScreenProps {
    isSignUpFlow: boolean;
    passwordlessStep: PasswordlessStep;
    email: string;
    onEmailChange: (text: string) => void;
    otp: string;
    onOtpChange: (text: string) => void;
    isLoading: boolean;
    onSendOtp: () => void;
    onVerifyOtp: () => void;
    onBack: () => void;
}

export const PasswordlessScreen: React.FC<PasswordlessScreenProps> = ({
    isSignUpFlow,
    passwordlessStep,
    email,
    onEmailChange,
    otp,
    onOtpChange,
    isLoading,
    onSendOtp,
    onVerifyOtp,
    onBack,
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>
                {isSignUpFlow ? 'Email OTP Sign Up' : 'Email OTP Login'}
            </Text>

            {passwordlessStep === 'email' ? (
                <View style={styles.passwordlessContainer}>
                    <Text style={styles.subtitle}>
                        Enter your email address to receive a verification code
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email Address"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={onEmailChange}
                    />
                    {isLoading ? (
                        <ActivityIndicator style={styles.loader} size="small" color="#0066CC" />
                    ) : (
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={onSendOtp}
                        >
                            <Text style={styles.primaryButtonText}>Send Code</Text>
                        </TouchableOpacity>
                    )}
                </View>
            ) : (
                <View style={styles.passwordlessContainer}>
                    <Text style={styles.subtitle}>
                        Enter the verification code sent to
                    </Text>
                    <Text style={styles.emailDisplay}>{email}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Verification Code"
                        keyboardType="number-pad"
                        value={otp}
                        onChangeText={onOtpChange}
                        maxLength={6}
                    />
                    {isLoading ? (
                        <ActivityIndicator style={styles.loader} size="small" color="#0066CC" />
                    ) : (
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={onVerifyOtp}
                        >
                            <Text style={styles.primaryButtonText}>Verify & Login</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={onBack}
                    >
                        <Text style={styles.secondaryButtonText}>Back to Email</Text>
                    </TouchableOpacity>
                </View>
            )}

            <TouchableOpacity
                style={styles.backButton}
                onPress={onBack}
            >
                <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
        </View>
    );
};
