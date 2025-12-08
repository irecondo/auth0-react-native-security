import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from '../styles/AppStyles';
import { PinDots } from '../components/PinDots';
import { PinPad } from '../components/PinPad';
import { UserInfo } from '../types';

interface LockScreenProps {
    userInfo: UserInfo | null;
    lockPinInput: string;
    onLockPinDigitPress: (digit: string) => void;
    onLockPinDelete: () => void;
    biometricsEnabled: boolean;
    biometryType: string | null;
    onBiometricAuth: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({
    userInfo,
    lockPinInput,
    onLockPinDigitPress,
    onLockPinDelete,
    biometricsEnabled,
    biometryType,
    onBiometricAuth,
}) => {
    return (
        <View style={styles.lockScreenContainer}>
            <View style={styles.lockScreenContent}>
                {userInfo?.picture && (
                    <Image
                        source={{ uri: userInfo.picture }}
                        style={styles.lockScreenAvatar}
                    />
                )}
                <Text style={styles.lockScreenGreeting}>
                    Hi, {userInfo?.given_name || userInfo?.name || 'there'}
                </Text>

                <PinDots filledCount={lockPinInput.length} />
                <PinPad
                    onDigitPress={onLockPinDigitPress}
                    onDelete={onLockPinDelete}
                    showBiometrics={true}
                    biometricsEnabled={biometricsEnabled}
                    biometryType={biometryType}
                    onBiometricAuth={onBiometricAuth}
                />

                <TouchableOpacity style={styles.forgotPinButton}>
                    <Text style={styles.forgotPinText}>Forgot your passcode?</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
