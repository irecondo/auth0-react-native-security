import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from '../styles/AppStyles';
import { UserInfo } from '../types';

interface HomeScreenProps {
    userInfo: UserInfo | null;
    onProfilePress: () => void;
    onSecurityPress: () => void;
    onLogout: () => void;
    onBackToLogin?: () => void; // Optional test button
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
    userInfo,
    onProfilePress,
    onSecurityPress,
    onLogout,
    onBackToLogin
}) => {
    return (
        <ScrollView style={styles.homeContainer}>
            <View style={styles.homeContent}>
                {userInfo?.picture && (
                    <Image
                        source={{ uri: userInfo.picture }}
                        style={styles.homeAvatar}
                    />
                )}
                <Text style={styles.homeEmail}>
                    {userInfo?.name || userInfo?.email}
                </Text>

                <View style={styles.homeButtonsContainer}>
                    <TouchableOpacity
                        style={styles.homeButton}
                        onPress={onProfilePress}
                    >
                        <Text style={styles.homeButtonIcon}>👤</Text>
                        <Text style={styles.homeButtonText}>My Profile</Text>
                        <Text style={styles.homeButtonArrow}>→</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.homeButton}
                        onPress={onSecurityPress}
                    >
                        <Text style={styles.homeButtonIcon}>🛡️</Text>
                        <Text style={styles.homeButtonText}>Security Options</Text>
                        <Text style={styles.homeButtonArrow}>→</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.homeButton}
                        onPress={() => console.log('Support pressed')} // Placeholder
                    >
                        <Text style={styles.homeButtonIcon}>💬</Text>
                        <Text style={styles.homeButtonText}>Support</Text>
                        <Text style={styles.homeButtonArrow}>→</Text>
                    </TouchableOpacity>

                    {onBackToLogin && (
                        <TouchableOpacity
                            style={styles.homeButton}
                            onPress={onBackToLogin}
                        >
                            <Text style={styles.homeButtonIcon}>🔙</Text>
                            <Text style={styles.homeButtonText}>Test: Back to Login</Text>
                            <Text style={styles.homeButtonArrow}>→</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={onLogout}
                >
                    <Text style={styles.logoutButtonText}>Log out</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};
