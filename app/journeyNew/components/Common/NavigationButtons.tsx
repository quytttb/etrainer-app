import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface NavigationButtonsProps {
     onPrevious?: () => void;
     onNext?: () => void;
     previousLabel?: string;
     nextLabel?: string;
     showPrevious?: boolean;
     showNext?: boolean;
     isPreviousDisabled?: boolean;
     isNextDisabled?: boolean;
     isNextLoading?: boolean;
     size?: 'small' | 'medium' | 'large';
     variant?: 'primary' | 'secondary' | 'outline';
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
     onPrevious,
     onNext,
     previousLabel = 'Previous',
     nextLabel = 'Next',
     showPrevious = true,
     showNext = true,
     isPreviousDisabled = false,
     isNextDisabled = false,
     isNextLoading = false,
     size = 'medium',
     variant = 'primary'
}) => {
     const getSizeStyles = () => {
          switch (size) {
               case 'small':
                    return {
                         container: styles.smallContainer,
                         button: styles.smallButton,
                         text: styles.smallText,
                    };
               case 'large':
                    return {
                         container: styles.largeContainer,
                         button: styles.largeButton,
                         text: styles.largeText,
                    };
               default:
                    return {
                         container: styles.mediumContainer,
                         button: styles.mediumButton,
                         text: styles.mediumText,
                    };
          }
     };

     const getVariantStyles = (isPrevious: boolean) => {
          switch (variant) {
               case 'secondary':
                    return {
                         button: styles.secondaryButton,
                         text: styles.secondaryText,
                         disabled: styles.secondaryDisabled,
                    };
               case 'outline':
                    return {
                         button: styles.outlineButton,
                         text: styles.outlineText,
                         disabled: styles.outlineDisabled,
                    };
               default:
                    return {
                         button: isPrevious ? styles.previousButton : styles.nextButton,
                         text: isPrevious ? styles.previousText : styles.nextText,
                         disabled: styles.disabledButton,
                    };
          }
     };

     const sizeStyles = getSizeStyles();

     return (
          <View style={[styles.container, sizeStyles.container]}>
               {showPrevious && (
                    <TouchableOpacity
                         style={[
                              styles.button,
                              sizeStyles.button,
                              getVariantStyles(true).button,
                              isPreviousDisabled && getVariantStyles(true).disabled
                         ]}
                         onPress={onPrevious}
                         disabled={isPreviousDisabled}
                    >
                         <Text style={[
                              styles.text,
                              sizeStyles.text,
                              getVariantStyles(true).text,
                              isPreviousDisabled && styles.disabledText
                         ]}>
                              {previousLabel}
                         </Text>
                    </TouchableOpacity>
               )}

               {showNext && (
                    <TouchableOpacity
                         style={[
                              styles.button,
                              sizeStyles.button,
                              getVariantStyles(false).button,
                              isNextDisabled && getVariantStyles(false).disabled
                         ]}
                         onPress={onNext}
                         disabled={isNextDisabled || isNextLoading}
                    >
                         {isNextLoading ? (
                              <ActivityIndicator
                                   color={variant === 'outline' ? '#2196f3' : '#fff'}
                                   size="small"
                              />
                         ) : (
                              <Text style={[
                                   styles.text,
                                   sizeStyles.text,
                                   getVariantStyles(false).text,
                                   isNextDisabled && styles.disabledText
                              ]}>
                                   {nextLabel}
                              </Text>
                         )}
                    </TouchableOpacity>
               )}
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: 16,
     },
     button: {
          flex: 1,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
     },
     text: {
          fontWeight: '600',
     },
     // Previous button
     previousButton: {
          backgroundColor: '#f5f5f5',
          borderWidth: 1,
          borderColor: '#ddd',
     },
     previousText: {
          color: '#333',
     },
     // Next button
     nextButton: {
          backgroundColor: '#2196f3',
     },
     nextText: {
          color: '#fff',
     },
     // Secondary variant
     secondaryButton: {
          backgroundColor: '#f5f5f5',
     },
     secondaryText: {
          color: '#666',
     },
     // Outline variant
     outlineButton: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: '#2196f3',
     },
     outlineText: {
          color: '#2196f3',
     },
     // Disabled states
     disabledButton: {
          opacity: 0.5,
     },
     disabledText: {
          color: '#999',
     },
     secondaryDisabled: {
          backgroundColor: '#f5f5f5',
          opacity: 0.5,
     },
     outlineDisabled: {
          borderColor: '#999',
          opacity: 0.5,
     },
     // Small size
     smallContainer: {
          gap: 8,
     },
     smallButton: {
          padding: 8,
     },
     smallText: {
          fontSize: 14,
     },
     // Medium size
     mediumContainer: {
          gap: 16,
     },
     mediumButton: {
          padding: 12,
     },
     mediumText: {
          fontSize: 16,
     },
     // Large size
     largeContainer: {
          gap: 24,
     },
     largeButton: {
          padding: 16,
     },
     largeText: {
          fontSize: 18,
     },
});

export default NavigationButtons; 