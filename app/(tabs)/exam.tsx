import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import Header from "../../components/Header";
import { useQuery } from "@tanstack/react-query";
import { getExamListService } from "./service";
import dayjs from "dayjs";
import { router } from "expo-router";

export default function Exam() {
  const { data } = useQuery({
    queryKey: ["EXAM"],
    queryFn: getExamListService,
  });

  return (
    <ScrollView style={styles.container}>
      <Header title="Thi thử" />

      {data && data.length > 0 ? (
        <>
          <View style={styles.categoryContainer}>
            <Text style={styles.category}>
              TOEIC Listening & Reading | {data.length}
            </Text>
          </View>

          <View style={styles.testList}>
            {data.map((test) => (
              <TouchableOpacity
                key={test._id}
                style={[styles.testCard]}
                onPress={() => router.push(`/exam/${test._id}`)}
              >
                <Image
                  source={require("../../assets/images/test.png")}
                  style={styles.test}
                />

                <Text style={styles.testText}>{test.name}</Text>
                <Text style={styles.yearText}>
                  ETS {dayjs(test.createdAt).year()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      ) : (
        <View style={{ width: "100%", marginTop: 100 }}>
          <Text style={styles.emptyTxt}>Chưa có đề thi nào</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },

  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 100,
  },

  category: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  full_testLink: {
    fontSize: 14,
    color: "#FF8C00",
  },
  mini_testLink: {
    fontSize: 14,
    color: "#FF8C00",
  },

  testList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: -55,
    marginTop: 20,
    paddingHorizontal: 20,
  },

  testCard: {
    backgroundColor: "#FFF",
    padding: 15,
    marginBottom: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "22%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    position: "relative",
  },

  lockedTest: {
    backgroundColor: "#D3D3D3",
  },

  test: {
    width: 35,
    height: 35,
    marginBottom: 10,
  },

  lockIcon: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1,
  },

  testText: {
    fontSize: 14,
    fontWeight: "bold",
    position: "absolute",
    top: 85,
    left: "150%",
    transform: [{ translateX: -50 }],
    color: "#000000",
  },

  yearText: {
    marginTop: 2,
    fontSize: 14,
    position: "absolute",
    top: 100,
    left: "100%",
    transform: [{ translateX: -50 }],
    color: "#000000",
    width: "180%",
    textAlign: "center",
  },

  emptyTxt: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginTop: 20,
  },
});
