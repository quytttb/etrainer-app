import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProgressIndicatorProps {
     current: number;
     total: number;
     label?: string;
     showPercentage?: boolean;
     size?: 'small' | 'medium' | 'large';
     color?: string;
     backgroundColor?: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
     current,
     total,
     label,
     showPercentage = true,
     size = 'medium',
     color = '#2196f3',
     backgroundColor = '#f5f5f5'
}) => {
     const percentage = Math.round((current / total) * 100);

     const getSizeStyles = () => {
          switch (size) {
               case 'small':
                    return {
                         container: styles.smallContainer,
                         bar: styles.smallBar,
                         text: styles.smallText,
                         label: styles.smallLabel,
                    };
               case 'large':
                    return {
                         container: styles.largeContainer,
                         bar: styles.largeBar,
                         text: styles.largeText,
                         label: styles.largeLabel,
                    };
               default:
                    return {
                         container: styles.mediumContainer,
                         bar: styles.mediumBar,
                         text: styles.mediumText,
                         label: styles.mediumLabel,
                    };
          }
     };

     const sizeStyles = getSizeStyles();

     return (
          <View style={[styles.container, sizeStyles.container]}>
               {label && <Text style={[styles.label, sizeStyles.label]}>{label}</Text>}

               <View style={[styles.progressContainer, { backgroundColor }]}>
                    <View
                         style={[
                              styles.progressBar,
                              sizeStyles.bar,
                              { backgroundColor: color, width: `${percentage}%` }
                         ]}
                    />
               </View>

               <View style={styles.statsContainer}>
                    <Text style={[styles.statsText, sizeStyles.text]}>
                         {current}/{total}
                    </Text>
                    {showPercentage && (
                         <Text style={[styles.percentageText, sizeStyles.text, { color }]}>
                              {percentage}%
                         </Text>
                    )}
               </View>
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          gap: 8,
     },
     label: {
          color: '#666',
     },
     progressContainer: {
          borderRadius: 4,
          overflow: 'hidden',
     },
     progressBar: {
          borderRadius: 4,
     },
     statsContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
     },
     statsText: {
          color: '#666',
     },
     percentageText: {
          fontWeight: '600',
     },
     // Small size
     smallContainer: {
          gap: 4,
     },
     smallBar: {
          height: 4,
     },
     smallText: {
          fontSize: 12,
     },
     smallLabel: {
          fontSize: 12,
     },
     // Medium size
     mediumContainer: {
          gap: 8,
     },
     mediumBar: {
          height: 8,
     },
     mediumText: {
          fontSize: 14,
     },
     mediumLabel: {
          fontSize: 14,
     },
     // Large size
     largeContainer: {
          gap: 12,
     },
     largeBar: {
          height: 12,
     },
     largeText: {
          fontSize: 16,
     },
     largeLabel: {
          fontSize: 16,
     },
});

export default ProgressIndicator;
export default ProgressIndicator; 