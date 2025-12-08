import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/AppStyles';
import { BiometryTypes } from 'react-native-biometrics';

interface OnboardingBioScreenProps {
    biometryType: string | null;
    biometricsAvailable: boolean;
    onEnable: () => void;
    onSkip: () => void;
}

export const OnboardingBioScreen: React.FC<OnboardingBioScreenProps> = ({
    biometryType,
    biometricsAvailable,
    onEnable,
    onSkip,
}) => {
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

    return (
        <View style={styles.onboardingContainer}>
            <View style={styles.onboardingContent}>
                <Text style={styles.onboardingIcon}>
                    {biometryType === BiometryTypes.FaceID ? '👤' : '👆'}
                </Text>
                <Text style={styles.onboardingTitle}>Enable {getBiometricsLabel()}</Text>
                <Text style={styles.onboardingSubtitle}>
                    Use {getBiometricsLabel()} for quick and secure access to your account
                </Text>

                {biometricsAvailable ? (
                    <>
                        <TouchableOpacity
                            style={styles.onboardingPrimaryButton}
                            onPress={onEnable}
                        >
                            <Text style={styles.onboardingPrimaryButtonText}>
                                Enable {getBiometricsLabel()}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.onboardingSecondaryButton}
                            onPress={onSkip}
                        >
                            <Text style={styles.onboardingSecondaryButtonText}>Skip for now</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <Text style={styles.onboardingNote}>
                            {getBiometricsLabel()} is not available on this device
                        </Text>
                        <TouchableOpacity
                            style={styles.onboardingPrimaryButton}
                            onPress={onSkip}
                        >
                            <Text style={styles.onboardingPrimaryButtonText}>Continue</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
};
