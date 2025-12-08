import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
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
}

export const SecurityScreen: React.FC<SecurityScreenProps> = ({
    onBack,
    biometryType,
    biometricsAvailable,
    biometricsEnabled,
    toggleBiometrics,
    storedPin,
    openChangePinScreen,
    onDevicesPress
}) => {
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
                                <Switch
                                    style={{ marginRight: 8 }}
                                    trackColor={{ false: '#767577', true: '#666666' }}
                                    onValueChange={toggleBiometrics}
                                    value={biometricsEnabled}
                                />
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
