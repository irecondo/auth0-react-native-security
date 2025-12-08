import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { styles } from '../styles/AppStyles';

interface PasskeysScreenProps {
    onBack: () => void;
    passkeys: any[];
    onCreatePasskey: () => void;
    onDeletePasskey: (id: string) => void;
}

export const PasskeysScreen: React.FC<PasskeysScreenProps> = ({
    onBack,
    passkeys,
    onCreatePasskey,
    onDeletePasskey
}) => {
    return (
        <ScrollView style={styles.scrollContainer}>
            <View style={styles.profileContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <TouchableOpacity
                        style={[styles.backButtonHeader, { marginBottom: 0 }]}
                        onPress={onBack}
                    >
                        <Text style={styles.backButtonHeaderText}>← Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ backgroundColor: '#5865F2', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 }}
                        onPress={onCreatePasskey}
                    >
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>+ New</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.header}>Passkeys</Text>

                <View style={styles.devicesContainer}>
                    {passkeys.length === 0 ? (
                        <Text style={{ textAlign: 'center', color: '#666', padding: 20 }}>
                            No passkeys registered yet.
                        </Text>
                    ) : (
                        passkeys.map((pk) => (
                            <View key={pk.id} style={[styles.deviceItem, { justifyContent: 'space-between', alignItems: 'center' }]}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                    <Text style={{ fontSize: 24, marginRight: 15 }}>👤</Text>
                                    <View>
                                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Passkey</Text>
                                        <Text style={{ color: '#666', fontSize: 12 }}>ID: {pk.id.substring(0, 10)}...</Text>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => onDeletePasskey(pk.id)}>
                                    <Text style={{ color: 'red', fontWeight: '500' }}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    )}
                </View>
            </View>
        </ScrollView>
    );
};
