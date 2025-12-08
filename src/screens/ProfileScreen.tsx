import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from '../styles/AppStyles';
import { UserInfo } from '../types';

interface ProfileScreenProps {
    userInfo: UserInfo;
    onBack: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ userInfo, onBack }) => {
    return (
        <ScrollView style={styles.scrollContainer}>
            <View style={styles.profileContainer}>
                <TouchableOpacity
                    style={styles.backButtonHeader}
                    onPress={onBack}
                >
                    <Text style={styles.backButtonHeaderText}>← Back</Text>
                </TouchableOpacity>

                <Text style={styles.header}>Profile</Text>

                {userInfo.picture && (
                    <Image
                        source={{ uri: userInfo.picture }}
                        style={styles.profileImage}
                    />
                )}

                <View style={styles.claimsContainer}>
                    {Object.keys(userInfo).map((key) => (
                        <View key={key} style={styles.claimRow}>
                            <Text style={styles.claimKey}>{key}:</Text>
                            <Text style={styles.claimValue}>
                                {typeof userInfo[key] === 'object'
                                    ? JSON.stringify(userInfo[key], null, 2)
                                    : String(userInfo[key])}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};
