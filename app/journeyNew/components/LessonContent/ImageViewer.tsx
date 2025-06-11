import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, Dimensions } from "react-native";

interface ImageViewerProps {
     imageUrl: string;
     title?: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ imageUrl, title }) => {
     const [isModalVisible, setIsModalVisible] = useState(false);
     const [imageLoading, setImageLoading] = useState(true);
     const [imageError, setImageError] = useState(false);

     const screenWidth = Dimensions.get('window').width;
     const imageWidth = screenWidth - 64; // Account for margins and padding

     const handleImagePress = () => {
          setIsModalVisible(true);
     };

     const handleCloseModal = () => {
          setIsModalVisible(false);
     };

     const handleImageLoad = () => {
          setImageLoading(false);
          setImageError(false);
     };

     const handleImageError = () => {
          setImageLoading(false);
          setImageError(true);
     };

     return (
          <View style={styles.container}>
               <View style={styles.header}>
                    <Text style={styles.imageIcon}>🖼️</Text>
                    <View style={styles.titleSection}>
                         <Text style={styles.label}>Hình ảnh</Text>
                         {title && <Text style={styles.title}>{title}</Text>}
                    </View>
                    <TouchableOpacity style={styles.expandButton} onPress={handleImagePress}>
                         <Text style={styles.expandIcon}>🔍</Text>
                    </TouchableOpacity>
               </View>

               {/* Image Container */}
               <TouchableOpacity
                    style={styles.imageContainer}
                    onPress={handleImagePress}
                    activeOpacity={0.8}
               >
                    {imageLoading && (
                         <View style={[styles.imagePlaceholder, { width: imageWidth, height: imageWidth * 0.6 }]}>
                              <Text style={styles.loadingText}>Đang tải...</Text>
                         </View>
                    )}

                    {imageError && (
                         <View style={[styles.imagePlaceholder, styles.errorPlaceholder, { width: imageWidth, height: imageWidth * 0.6 }]}>
                              <Text style={styles.errorIcon}>⚠️</Text>
                              <Text style={styles.errorText}>Không thể tải hình ảnh</Text>
                         </View>
                    )}

                    {!imageError && (
                         <Image
                              source={{ uri: imageUrl }}
                              style={[
                                   styles.image,
                                   {
                                        width: imageWidth,
                                        height: imageWidth * 0.6,
                                        opacity: imageLoading ? 0 : 1
                                   }
                              ]}
                              onLoad={handleImageLoad}
                              onError={handleImageError}
                              resizeMode="cover"
                         />
                    )}

                    {/* Overlay hint */}
                    {!imageLoading && !imageError && (
                         <View style={styles.overlay}>
                              <Text style={styles.overlayText}>Nhấn để phóng to</Text>
                         </View>
                    )}
               </TouchableOpacity>

               {/* Full Screen Modal */}
               <Modal
                    visible={isModalVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={handleCloseModal}
               >
                    <View style={styles.modalContainer}>
                         <TouchableOpacity
                              style={styles.modalBackground}
                              onPress={handleCloseModal}
                              activeOpacity={1}
                         >
                              <View style={styles.modalContent}>
                                   <View style={styles.modalHeader}>
                                        <Text style={styles.modalTitle}>{title || "Hình ảnh"}</Text>
                                        <TouchableOpacity
                                             style={styles.closeButton}
                                             onPress={handleCloseModal}
                                        >
                                             <Text style={styles.closeIcon}>✕</Text>
                                        </TouchableOpacity>
                                   </View>

                                   <Image
                                        source={{ uri: imageUrl }}
                                        style={styles.modalImage}
                                        resizeMode="contain"
                                   />
                              </View>
                         </TouchableOpacity>
                    </View>
               </Modal>
          </View>
     );
};

const styles = StyleSheet.create({
     container: {
          backgroundColor: "#fff",
          marginHorizontal: 16,
          marginVertical: 8,
          borderRadius: 12,
          padding: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          borderLeftWidth: 4,
          borderLeftColor: "#27ae60",
     },
     header: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 12,
     },
     imageIcon: {
          fontSize: 24,
          marginRight: 12,
     },
     titleSection: {
          flex: 1,
     },
     label: {
          fontSize: 12,
          color: "#7f8c8d",
          fontWeight: "600",
          textTransform: "uppercase",
          marginBottom: 2,
     },
     title: {
          fontSize: 14,
          color: "#2c3e50",
          fontWeight: "500",
     },
     expandButton: {
          padding: 8,
     },
     expandIcon: {
          fontSize: 20,
     },
     imageContainer: {
          position: "relative",
          alignItems: "center",
          borderRadius: 8,
          overflow: "hidden",
     },
     image: {
          borderRadius: 8,
     },
     imagePlaceholder: {
          backgroundColor: "#f8f9fa",
          borderRadius: 8,
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 2,
          borderColor: "#e9ecef",
          borderStyle: "dashed",
     },
     errorPlaceholder: {
          backgroundColor: "#fff5f5",
          borderColor: "#fed7d7",
     },
     loadingText: {
          fontSize: 14,
          color: "#6c757d",
          fontStyle: "italic",
     },
     errorIcon: {
          fontSize: 24,
          marginBottom: 8,
     },
     errorText: {
          fontSize: 14,
          color: "#e53e3e",
          textAlign: "center",
     },
     overlay: {
          position: "absolute",
          bottom: 8,
          right: 8,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 4,
     },
     overlayText: {
          color: "#fff",
          fontSize: 12,
          fontWeight: "500",
     },
     // Modal styles
     modalContainer: {
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.9)",
     },
     modalBackground: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
     },
     modalContent: {
          width: "90%",
          maxHeight: "80%",
          backgroundColor: "#fff",
          borderRadius: 12,
          overflow: "hidden",
     },
     modalHeader: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 16,
          backgroundColor: "#f8f9fa",
          borderBottomWidth: 1,
          borderBottomColor: "#e9ecef",
     },
     modalTitle: {
          fontSize: 16,
          fontWeight: "600",
          color: "#2c3e50",
          flex: 1,
     },
     closeButton: {
          padding: 4,
     },
     closeIcon: {
          fontSize: 18,
          color: "#6c757d",
          fontWeight: "bold",
     },
     modalImage: {
          width: "100%",
          height: 300,
     },
});

export default ImageViewer; 