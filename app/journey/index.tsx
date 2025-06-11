// Main Journey Screen - Entry point for merged journey
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

// Import providers for context
import { AnswerProvider } from './context/AnswerContext';
import { ProgressProvider } from './context/ProgressContext';

const JourneyMain: React.FC = () => {
     const router = useRouter();

     return (
          <View style={styles.container}>
               <View style={styles.header}>
                    <FontAwesome5 name="book-open" size={48} color="#0099CC" />
                    <Text style={styles.title}>Journey Learning</Text>
                    <Text style={styles.subtitle}>
                         Enhanced journey with modern architecture
                    </Text>
               </View>

               <View style={styles.content}>
                    <Text style={styles.description}>
                         ✅ Combined UI from journeyStudy + Modern Logic from journeyNew
                    </Text>

                    <View style={styles.features}>
                         <Text style={styles.featureItem}>🎯 Modern State Management</Text>
                         <Text style={styles.featureItem}>📱 Enhanced UI/UX</Text>
                         <Text style={styles.featureItem}>⚡ Performance Optimized</Text>
                         <Text style={styles.featureItem}>🔒 TypeScript Full Coverage</Text>
                    </View>
               </View>

               <View style={styles.actions}>
                    <TouchableOpacity
                         style={styles.button}
                         onPress={() => router.push('/journeyStudy/')}
                    >
                         <Text style={styles.buttonText}>Legacy Journey (Original)</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                         style={[styles.button, styles.primaryButton]}
                         onPress={() => router.push('/journey/screens/DayQuestions')}
                    >
                         <Text style={[styles.buttonText, styles.primaryButtonText]}>
                              Merged Journey (Recommended)
                         </Text>
                    </TouchableOpacity>
               </View>
          </View>
     );
};

// Main wrapper with providers
const JourneyMainWithProviders: React.FC = () => {
     return (
          <AnswerProvider>
               <ProgressProvider>
                    <JourneyMain />
               </ProgressProvider>
          </AnswerProvider>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#f5f5f5',
          padding: 20,
     },
     header: {
          alignItems: 'center',
          marginVertical: 40,
     },
     title: {
          fontSize: 28,
          fontWeight: 'bold',
          color: '#333',
          marginTop: 16,
     },
     subtitle: {
          fontSize: 16,
          color: '#666',
          marginTop: 8,
          textAlign: 'center',
     },
     content: {
          flex: 1,
          justifyContent: 'center',
     },
     description: {
          fontSize: 18,
          color: '#333',
          textAlign: 'center',
          marginBottom: 32,
          fontWeight: '600',
     },
     features: {
          backgroundColor: '#fff',
          padding: 20,
          borderRadius: 12,
          elevation: 3,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
     },
     featureItem: {
          fontSize: 16,
          color: '#333',
          marginBottom: 12,
          paddingLeft: 8,
     },
     actions: {
          marginTop: 40,
     },
     button: {
          backgroundColor: '#e0e0e0',
          padding: 16,
          borderRadius: 8,
          marginBottom: 12,
          alignItems: 'center',
     },
     primaryButton: {
          backgroundColor: '#0099CC',
     },
     buttonText: {
          fontSize: 16,
          color: '#333',
          fontWeight: '600',
     },
     primaryButtonText: {
          color: '#fff',
     },
});

export default JourneyMainWithProviders;
