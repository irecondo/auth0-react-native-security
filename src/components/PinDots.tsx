import React from 'react';
import { View } from 'react-native';
import { styles } from '../styles/AppStyles';

interface PinDotsProps {
    filledCount: number;
}

export const PinDots: React.FC<PinDotsProps> = ({ filledCount }) => (
    <View style={styles.pinDotsContainer}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
            <View
                key={i}
                style={[
                    styles.pinDot,
                    i < filledCount && styles.pinDotFilled
                ]}
            />
        ))}
    </View>
);
