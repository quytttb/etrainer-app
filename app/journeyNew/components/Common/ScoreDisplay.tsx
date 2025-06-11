import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ScoreDisplayProps {
     score: number;
     total: number;
     label?: string;
     showPercentage?: boolean;
     size?: 'small' | 'medium' | 'large';
     passingScore?: number;
     showPassingIndicator?: boolean;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
     score,
     total,
     label,
     showPercentage = true,
     size = 'medium',
     passingScore = 60,
     showPassingIndicator = true
}) => {
     const percentage = Math.round((score / total) * 100);
     const isPassing = percentage >= passingScore;

     const getSizeStyles = () => {
          switch (size) {
               case 'small':
                    return {
                         container: styles.smallContainer,
                         score: styles.smallScore,
                         total: styles.smallTotal,
                         percentage: styles.smallPercentage,
                         label: styles.smallLabel,
                    };
               case 'large':
                    return {
                         container: styles.largeContainer,
                         score: styles.largeScore,
                         total: styles.largeTotal,
                         percentage: styles.largePercentage,
                         label: styles.largeLabel,
                    };
               default:
                    return {
                         container: styles.mediumContainer,
                         score: styles.mediumScore,
                         total: styles.mediumTotal,
                         percentage: styles.mediumPercentage,
                         label: styles.mediumLabel,
                    };
          }
     };

     const sizeStyles = getSizeStyles();

     return (
          <View style={[styles.container, sizeStyles.container]}>
               {label && (
                    <Text style={[styles.label, sizeStyles.label]}>
                         {label}
                    </Text>
               )}

               <View style={styles.scoreContainer}>
                    <Text style={[styles.score, sizeStyles.score]}>
                         {score}
                    </Text>
                    <Text style={[styles.total, sizeStyles.total]}>
                         /{total}
                    </Text>
               </View>

               {showPercentage && (
                    <Text
                         style={[
                              styles.percentage,
                              sizeStyles.percentage,
                              isPassing ? styles.passingScore : styles.failingScore
                         ]}
                    >
                         {percentage}%
                    </Text>
               )}

               {showPassingIndicator && (
                    <View style={styles.passingContainer}>
                         <View
                              style={[
                                   styles.passingDot,
                                   isPassing ? styles.passingDotSuccess : styles.passingDotFail
                              ]}
                         />
                         <Text style={[
                              styles.passingText,
                              isPassing ? styles.passingTextSuccess : styles.passingTextFail
                         ]}>
                              {isPassing ? 'Passing' : 'Not Passing'}
                         </Text>
                    </View>
               )}
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          alignItems: 'center',
     },
     label: {
          color: '#666',
          marginBottom: 4,
     },
     scoreContainer: {
          flexDirection: 'row',
          alignItems: 'baseline',
     },
     score: {
          color: '#333',
          fontWeight: '600',
     },
     total: {
          color: '#666',
     },
     percentage: {
          marginTop: 4,
          fontWeight: '600',
     },
     passingScore: {
          color: '#4caf50',
     },
     failingScore: {
          color: '#f44336',
     },
     passingContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 8,
          gap: 4,
     },
     passingDot: {
          width: 8,
          height: 8,
          borderRadius: 4,
     },
     passingDotSuccess: {
          backgroundColor: '#4caf50',
     },
     passingDotFail: {
          backgroundColor: '#f44336',
     },
     passingText: {
          fontSize: 12,
     },
     passingTextSuccess: {
          color: '#4caf50',
     },
     passingTextFail: {
          color: '#f44336',
     },
     // Small size
     smallContainer: {
          padding: 8,
     },
     smallScore: {
          fontSize: 16,
     },
     smallTotal: {
          fontSize: 14,
     },
     smallPercentage: {
          fontSize: 12,
     },
     smallLabel: {
          fontSize: 12,
     },
     // Medium size
     mediumContainer: {
          padding: 16,
     },
     mediumScore: {
          fontSize: 24,
     },
     mediumTotal: {
          fontSize: 18,
     },
     mediumPercentage: {
          fontSize: 16,
     },
     mediumLabel: {
          fontSize: 14,
     },
     // Large size
     largeContainer: {
          padding: 24,
     },
     largeScore: {
          fontSize: 36,
     },
     largeTotal: {
          fontSize: 24,
     },
     largePercentage: {
          fontSize: 20,
     },
     largeLabel: {
          fontSize: 16,
     },
});

export default ScoreDisplay; 