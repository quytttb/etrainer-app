import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import Header from "../../components/Header";
import { useQuery } from "@tanstack/react-query";
import { getNotificationService } from "./service";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Ionicons } from "@expo/vector-icons";

dayjs.extend(relativeTime);

const NotificationScreen = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["NOTIFICATION"],
    queryFn: getNotificationService,
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7f9fc" />
      <Header
        title="Thông báo"
        onBackPress={() => router.push("/home" as any)}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          {data && data?.length > 0 ? (
            <>
              {data.map((item) => (
                <TouchableOpacity
                  key={item._id}
                  style={styles.notificationItem}
                  activeOpacity={0.7}
                >
                  <View style={styles.notificationIcon}>
                    <View style={styles.iconCircle}>
                      <Ionicons
                        name="notifications"
                        size={20}
                        color="#0099CC"
                      />
                    </View>
                  </View>
                  <View style={styles.notificationTextContainer}>
                    <Text style={styles.notificationTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text
                      style={styles.notificationDescription}
                      numberOfLines={2}
                    >
                      {item.message}
                    </Text>
                    <Text style={styles.notificationTime}>
                      {dayjs(item.createdAt).fromNow()}
                    </Text>
                  </View>

                  {/* {!item.isRead && <View style={styles.unreadDot} />} */}
                </TouchableOpacity>
              ))}
            </>
          ) : (
            <View style={styles.emptyState}>
              <Image
                source={{
                  uri: "https://img.icons8.com/ios/50/000000/folder-invoices--v1.png",
                }}
                style={styles.emptyIcon}
              />

              <Text style={styles.emptyTitle}>Chưa có thông báo</Text>
              <Text style={styles.emptyMessage}>
                Bạn sẽ nhận được thông báo khi có hoạt động mới.
              </Text>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={() => refetch()}
              >
                <Ionicons name="refresh" size={16} color="#fff" />
                <Text style={styles.refreshButtonText}>Làm mới</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fc",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  content: {
    paddingTop: 16,
    paddingHorizontal: 16,
    marginTop: 80,
  },

  notificationItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    position: "relative",
  },
  notificationIcon: {
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(47, 192, 149, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 6,
  },
  notificationDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: "#999",
  },
  unreadDot: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#0099CC",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  refreshButton: {
    flexDirection: "row",
    backgroundColor: "#0099CC",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#0099CC",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  refreshButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default NotificationScreen;
