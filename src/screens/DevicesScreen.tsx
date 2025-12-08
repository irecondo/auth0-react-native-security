import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from '../styles/AppStyles';

interface DevicesScreenProps {
    onBack: () => void;
    deviceModel: string;
}

export const DevicesScreen: React.FC<DevicesScreenProps> = ({ onBack, deviceModel }) => {
    return (
        <ScrollView style={styles.scrollContainer}>
            <View style={styles.profileContainer}>
                <TouchableOpacity
                    style={styles.backButtonHeader}
                    onPress={onBack}
                >
                    <Text style={styles.backButtonHeaderText}>← Back</Text>
                </TouchableOpacity>

                <Text style={styles.header}>Devices</Text>

                <Text style={styles.deviceSubtitle}>
                    You are currently logged in on these devices:
                </Text>

                <View style={styles.devicesContainer}>
                    <View style={styles.deviceItem}>
                        <Text style={styles.deviceItemIcon}>📱</Text>
                        <View style={styles.deviceInfo}>
                            <Text style={styles.deviceName}>{deviceModel}</Text>
                            <Text style={styles.currentDeviceText}>Current Device</Text>
                        </View>
                        <View style={styles.deviceCheckContainer}>
                            <View style={styles.deviceCheckCircle}>
                                <Text style={styles.deviceCheckmark}>✓</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};
