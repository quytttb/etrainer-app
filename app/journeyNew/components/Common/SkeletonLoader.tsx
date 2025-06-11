import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
     useAnimatedStyle,
     useSharedValue,
     withRepeat,
     withTiming,
     Easing,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SkeletonLoaderProps {
     width?: number | string;
     height?: number;
     borderRadius?: number;
     style?: any;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
     width = '100%',
     height = 20,
     borderRadius = 4,
     style
}) => {
     const opacity = useSharedValue(0.3);

     React.useEffect(() => {
          opacity.value = withRepeat(
               withTiming(1, {
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
               }),
               -1,
               true
          );
     }, []);

     const animatedStyle = useAnimatedStyle(() => ({
          opacity: opacity.value,
     }));

     return (
          <Animated.View
               style={[
                    styles.skeleton,
                    {
                         width,
                         height,
                         borderRadius,
                    },
                    animatedStyle,
                    style,
               ]}
          />
     );
};

// Skeleton for Journey Card
export const JourneyCardSkeleton: React.FC = () => (
     <View style={styles.journeyCardContainer}>
          <SkeletonLoader width="60%" height={24} style={{ marginBottom: 8 }} />
          <SkeletonLoader width="80%" height={16} style={{ marginBottom: 16 }} />
          <SkeletonLoader width="100%" height={8} borderRadius={4} style={{ marginBottom: 8 }} />
          <View style={styles.journeyCardStats}>
               <SkeletonLoader width={60} height={14} />
               <SkeletonLoader width={80} height={14} />
          </View>
     </View>
);

// Skeleton for Stage List
export const StageListSkeleton: React.FC = () => (
     <View style={styles.stageListContainer}>
          {[1, 2, 3].map((item) => (
               <View key={item} style={styles.stageItemContainer}>
                    <SkeletonLoader width={40} height={40} borderRadius={20} />
                    <View style={styles.stageItemContent}>
                         <SkeletonLoader width="70%" height={18} style={{ marginBottom: 4 }} />
                         <SkeletonLoader width="50%" height={14} style={{ marginBottom: 8 }} />
                         <SkeletonLoader width="100%" height={6} borderRadius={3} />
                    </View>
               </View>
          ))}
     </View>
);

const styles = StyleSheet.create({
     skeleton: {
          backgroundColor: '#E0E0E0',
     },
     journeyCardContainer: {
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 12,
          marginHorizontal: 16,
          marginVertical: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
     },
     journeyCardStats: {
          flexDirection: 'row',
          justifyContent: 'space-between',
     },
     stageListContainer: {
          paddingHorizontal: 16,
     },
     stageItemContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 12,
          marginBottom: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
     },
     stageItemContent: {
          flex: 1,
          marginLeft: 12,
     },
});

export default SkeletonLoader; 