import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface DataStaleIndicatorProps {
     isVisible: boolean;
     onRefresh: () => void;
     message?: string;
}

const DataStaleIndicator: React.FC<DataStaleIndicatorProps> = ({
     isVisible,
     onRefresh,
     message = "Dữ liệu đã cũ. Nhấn để cập nhật."
}) => {
     if (!isVisible) return null;

     return (
          <TouchableOpacity style={styles.container} onPress={onRefresh} activeOpacity={0.8}>
               <View style={styles.content}>
                    <Text style={styles.icon}>⚠️</Text>
                    <Text style={styles.message}>{message}</Text>
                    <Text style={styles.action}>Nhấn để cập nhật</Text>
               </View>
          </TouchableOpacity>
     );
};

const styles = StyleSheet.create({
     container: {
          backgroundColor: '#fff3cd',
          borderColor: '#ffeaa7',
          borderWidth: 1,
          borderRadius: 8,
          marginHorizontal: 16,
          marginBottom: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
     },
     content: {
          flexDirection: 'row',
          alignItems: 'center',
          padding: 12,
     },
     icon: {
          fontSize: 16,
          marginRight: 8,
     },
     message: {
          flex: 1,
          fontSize: 14,
          color: '#856404',
          fontWeight: '500',
     },
     action: {
          fontSize: 12,
          color: '#6c757d',
          fontStyle: 'italic',
     },
});

export default DataStaleIndicator; 