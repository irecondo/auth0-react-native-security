import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/AppStyles';
import { PinDots } from '../components/PinDots';
import { PinPad } from '../components/PinPad';

interface ChangePinScreenProps {
    onBack?: () => void;
    isPinConfirmStep: boolean;
    pinInput: string;
    confirmPinInput: string;
    onPinDigitPress: (digit: string) => void;
    onPinDelete: () => void;
}

export const ChangePinScreen: React.FC<ChangePinScreenProps> = ({
    onBack,
    isPinConfirmStep,
    pinInput,
    confirmPinInput,
    onPinDigitPress,
    onPinDelete
}) => {
    return (
        <View style={styles.onboardingContainer}>
            {onBack && (
                <TouchableOpacity
                    style={styles.changePinBackButton}
                    onPress={onBack}
                >
                    <Text style={styles.changePinBackButtonText}>Cancel</Text>
                </TouchableOpacity>
            )}

            <View style={styles.onboardingContent}>
                <Text style={styles.header}>Change PIN</Text>

                <Text style={styles.pinSetupTitle}>
                    {isPinConfirmStep ? 'Confirm new PIN' : 'Enter new PIN'}
                </Text>
                <Text style={styles.pinSetupSubtitle}>
                    {isPinConfirmStep
                        ? 'Re-enter your new PIN to confirm'
                        : 'Enter a new 6-digit PIN'}
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
