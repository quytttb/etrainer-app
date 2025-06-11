import React from 'react';
import { View, StyleSheet } from 'react-native';
import useBackHandler from '../hooks/useBackHandler';

interface NavigationWrapperProps {
     children: React.ReactNode;
     onBackPress?: () => boolean | void;
     enableBackHandler?: boolean;
}

const NavigationWrapper: React.FC<NavigationWrapperProps> = ({
     children,
     onBackPress,
     enableBackHandler = true,
}) => {
     // Use the global back handler
     useBackHandler({
          onBackPress,
          enabled: enableBackHandler,
     });

     return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
     },
});

export default NavigationWrapper; 