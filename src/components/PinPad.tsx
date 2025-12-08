import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { BiometryTypes } from 'react-native-biometrics';
import { styles } from '../styles/AppStyles';

interface PinPadProps {
    onDigitPress: (digit: string) => void;
    onDelete: () => void;
    showBiometrics?: boolean;
    biometryType?: string | null;
    biometricsEnabled?: boolean;
    onBiometricAuth?: () => void;
}

export const PinPad: React.FC<PinPadProps> = ({
    onDigitPress,
    onDelete,
    showBiometrics = false,
    biometryType,
    biometricsEnabled,
    onBiometricAuth
}) => {
    return (
        <View style={styles.pinPadContainer}>
            {[['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['bio', '0', 'del']].map((row, rowIndex) => (
                <View key={rowIndex} style={styles.pinPadRow}>
                    {row.map((item) => {
                        if (item === 'bio') {
                            if (showBiometrics && biometricsEnabled && onBiometricAuth) {
                                return (
                                    <TouchableOpacity
                                        key={item}
                                        style={styles.pinPadButton}
                                        onPress={onBiometricAuth}
                                    >
                                        <Text style={styles.pinPadBioText}>
                                            {biometryType === BiometryTypes.FaceID ? '👤' : '👆'}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }
                            return <View key={item} style={styles.pinPadButtonEmpty} />;
                        }
                        if (item === 'del') {
                            return (
                                <TouchableOpacity
                                    key={item}
                                    style={styles.pinPadButton}
                                    onPress={onDelete}
                                >
                                    <Text style={styles.pinPadDeleteText}>⌫</Text>
                                </TouchableOpacity>
                            );
                        }
                        return (
                            <TouchableOpacity
                                key={item}
                                style={styles.pinPadButton}
                                onPress={() => onDigitPress(item)}
                            >
                                <Text style={styles.pinPadText}>{item}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            ))}
        </View>
    );
};
