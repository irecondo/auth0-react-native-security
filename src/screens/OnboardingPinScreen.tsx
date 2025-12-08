import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/AppStyles';
import { PinDots } from '../components/PinDots';
import { PinPad } from '../components/PinPad';

interface OnboardingPinScreenProps {
    pinInput: string;
    confirmPinInput: string;
    isPinConfirmStep: boolean;
    onPinDigitPress: (digit: string) => void;
    onPinDelete: () => void;
}

export const OnboardingPinScreen: React.FC<OnboardingPinScreenProps> = ({
    pinInput,
    confirmPinInput,
    isPinConfirmStep,
    onPinDigitPress,
    onPinDelete,
}) => {
    return (
        <View style={styles.onboardingContainer}>
            <View style={styles.onboardingContent}>
                <Text style={styles.header}>Set up App PIN</Text>

                <Text style={styles.pinSetupTitle}>
                    {isPinConfirmStep ? 'Confirm your PIN' : 'Create a 6-digit PIN'}
                </Text>
                <Text style={styles.pinSetupSubtitle}>
                    {isPinConfirmStep
                        ? 'Re-enter your PIN to confirm'
                        : 'This PIN will be used to access your account'}
                </Text>

                <PinDots filledCount={isPinConfirmStep ? confirmPinInput.length : pinInput.length} />
                <PinPad
                    onDigitPress={onPinDigitPress}
                    onDelete={onPinDelete}
                />
            </View>
        </View>
    );
};
