import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { styles } from '../styles/AppStyles';

export const LoadingScreen = () => (
    <View style={styles.container}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.statusText}>Loading...</Text>
    </View>
);
