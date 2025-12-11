import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from '../styles/AppStyles';

interface SecurityScreenProps {
    onBack: () => void;
    biometryType: string | null;
    biometricsAvailable: boolean;
    biometricsEnabled: boolean;
    toggleBiometrics: () => void;
    storedPin: string | null;
    openChangePinScreen: () => void;
    onDevicesPress: () => void;
    autoLockEnabled: boolean;
    autoLockTimeout: number;
    onToggleAutoLock: () => void;
    onSelectAutoLockTimeout: (minutes: number) => void;
}

export const SecurityScreen: React.FC<SecurityScreenProps> = ({
    onBack,
    biometryType,
    biometricsAvailable,
    biometricsEnabled,
    toggleBiometrics,
    storedPin,
    openChangePinScreen,
    onDevicesPress,
    autoLockEnabled,
    autoLockTimeout,
    onToggleAutoLock,
    onSelectAutoLockTimeout
}) => {
    const [showAutoLockOptions, setShowAutoLockOptions] = useState<boolean>(false);

    const timeOptions = [1, 5, 10];
    const autoLockAvailable = !!storedPin;
    const autoLockOptionsVisible = autoLockAvailable && (autoLockEnabled || showAutoLockOptions);

    return (
        <ScrollView style={styles.scrollContainer}>
            <View style={styles.profileContainer}>
                <TouchableOpacity
                    style={styles.backButtonHeader}
                    onPress={onBack}
                >
                    <Text style={styles.backButtonHeaderText}>← Back</Text>
                </TouchableOpacity>

                <Text style={styles.header}>Security</Text>

                <Text style={styles.sectionHeader}>Sign-in & Passcode</Text>
                <View style={styles.securityOptionsContainer}>
                    {/* Biometrics toggle */}
                    <TouchableOpacity
                        style={[styles.securityOption, { borderBottomWidth: 1, borderBottomColor: '#F0F0F0', borderRadius: 0, borderTopLeftRadius: 12, borderTopRightRadius: 12, marginBottom: 0 }]}
                        onPress={toggleBiometrics}
                        disabled={!biometricsAvailable}
                    >
                        <View style={styles.securityOptionInfo}>
                            <Text style={styles.securityOptionIcon}>
                                {biometryType === 'FaceID' ? '👤' : '👆'}
                            </Text>
                            <View style={styles.securityOptionText}>
                                <Text style={styles.securityOptionTitle}>
                                    Sign in {biometryType === 'FaceID' ? 'Face ID' : 'Touch ID'}
                                </Text>
                                <Text style={styles.securityOptionStatus}>
                                    {!biometricsAvailable
                                        ? 'Not available'
                                        : biometricsEnabled
                                            ? 'Enabled'
                                            : 'Disabled'}
                                </Text>
                            </View>
                            {biometricsAvailable && (
                                <TouchableOpacity
                                    style={[
                                        styles.checkbox,
                                        biometricsEnabled && styles.checkboxChecked
                                    ]}
                                    onPress={toggleBiometrics}
                                    activeOpacity={0.7}
                                >
                                    {biometricsEnabled && <Text style={styles.checkmark}>✓</Text>}
                                </TouchableOpacity>
                            )}
                        </View>
                    </TouchableOpacity>

                    {/* PIN option */}
                    <TouchableOpacity
                        style={[styles.securityOption, { borderRadius: 0, marginBottom: 0, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', borderTopWidth: 0 }]}
                        onPress={openChangePinScreen}
                    >
                        <View style={styles.securityOptionInfo}>
                            <Text style={styles.securityOptionIcon}>🔢</Text>
                            <View style={styles.securityOptionText}>
                                <Text style={styles.securityOptionTitle}>Change PIN passcode</Text>
                                <Text style={styles.securityOptionStatus}>
                                    {storedPin ? 'Change your 6-digit PIN' : 'Set up PIN'}
                                </Text>
                            </View>
                            <Text style={styles.arrowIcon}>→</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Auto-lock toggle */}
                    <TouchableOpacity
                        style={[styles.securityOption, { borderRadius: 0, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, marginBottom: 0 }]}
                        onPress={() => {
                            if (!autoLockAvailable) return;
                            setShowAutoLockOptions(prev => !prev);
                        }}
                        disabled={!autoLockAvailable}
                    >
                        <View style={styles.securityOptionInfo}>
                            <Text style={styles.securityOptionIcon}>⏱️</Text>
                            <View style={styles.securityOptionText}>
                                <Text style={styles.securityOptionTitle}>Auto-lock after inactivity</Text>
                                <Text style={styles.securityOptionStatus}>
                                    {autoLockAvailable
                                        ? `${autoLockEnabled ? 'On' : 'Off'} • ${autoLockTimeout} min`
                                        : 'Set up a PIN to enable'}
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={[
                                    styles.checkbox,
                                    autoLockEnabled && styles.checkboxChecked,
                                    !autoLockAvailable && { opacity: 0.3 }
                                ]}
                                onPress={() => {
                                    if (!autoLockAvailable) return;
                                    onToggleAutoLock();
                                    setShowAutoLockOptions(true);
                                }}
                                disabled={!autoLockAvailable}
                                activeOpacity={0.7}
                            >
                                {autoLockEnabled && <Text style={styles.checkmark}>✓</Text>}
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                    {autoLockOptionsVisible && (
                        <View style={styles.autoLockOptionsRow}>
                            {timeOptions.map(minutes => (
                                <TouchableOpacity
                                    key={minutes}
                                    style={[
                                        styles.autoLockOption,
                                        autoLockTimeout === minutes && styles.autoLockOptionSelected
                                    ]}
                                    onPress={() => onSelectAutoLockTimeout(minutes)}
                                >
                                    <Text
                                        style={[
                                            styles.autoLockOptionText,
                                            autoLockTimeout === minutes && styles.autoLockOptionTextSelected
                                        ]}
                                    >
                                        {minutes} min
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                <Text style={[styles.sectionHeader, { marginTop: 24 }]}>Devices</Text>
                <View style={styles.securityOptionsContainer}>
                    {/* Devices option */}
                    <TouchableOpacity
                        style={[styles.securityOption, { borderRadius: 0, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, marginBottom: 0, borderBottomWidth: 0 }]}
                        onPress={onDevicesPress}
                    >
                        <View style={styles.securityOptionInfo}>
                            <Text style={styles.securityOptionIcon}>📱</Text>
                            <View style={styles.securityOptionText}>
                                <Text style={styles.securityOptionTitle}>Devices</Text>
                                <Text style={styles.securityOptionStatus}>
                                    Manage active devices
                                </Text>
                            </View>
                            <Text style={styles.arrowIcon}>→</Text>
                        </View>
                    </TouchableOpacity>
                </View>


            </View>
        </ScrollView>
    );
};
