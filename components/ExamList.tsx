import React from "react"; // Explicitly import React
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { router } from "expo-router";

interface ExamListProps {
  data: { id: string; title: string; description: string }[];
}

export default function ExamList({ data }: ExamListProps) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => router.push(`./exam/${item.id}`)}>
          <Text style={styles.partTitle}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  partTitle: { fontSize: 18, fontWeight: 'bold' },
  description: { fontSize: 14, color: 'gray' },
});
