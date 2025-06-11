import React from "react";
import {
     View,
     Text,
     StyleSheet,
     TouchableOpacity,
     Modal,
     TouchableWithoutFeedback,
} from "react-native";

interface ConfirmModalProps {
     visible: boolean;
     title: string;
     message: string;
     confirmText?: string;
     cancelText?: string;
     onConfirm: () => void;
     onCancel: () => void;
     confirmColor?: string;
     cancelColor?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
     visible,
     title,
     message,
     confirmText = "Xác nhận",
     cancelText = "Hủy",
     onConfirm,
     onCancel,
     confirmColor = "#e74c3c",
     cancelColor = "#95a5a6",
}) => {
     return (
          <Modal
               visible={visible}
               transparent={true}
               animationType="fade"
               onRequestClose={onCancel}
          >
               <TouchableWithoutFeedback onPress={onCancel}>
                    <View style={styles.overlay}>
                         <TouchableWithoutFeedback onPress={() => { }}>
                              <View style={styles.modal}>
                                   <Text style={styles.title}>{title}</Text>
                                   <Text style={styles.message}>{message}</Text>

                                   <View style={styles.buttonContainer}>
                                        <TouchableOpacity
                                             style={[styles.button, styles.cancelButton, { backgroundColor: cancelColor }]}
                                             onPress={onCancel}
                                        >
                                             <Text style={styles.cancelButtonText}>{cancelText}</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                             style={[styles.button, styles.confirmButton, { backgroundColor: confirmColor }]}
                                             onPress={onConfirm}
                                        >
                                             <Text style={styles.confirmButtonText}>{confirmText}</Text>
                                        </TouchableOpacity>
                                   </View>
                              </View>
                         </TouchableWithoutFeedback>
                    </View>
               </TouchableWithoutFeedback>
          </Modal>
     );
};

const styles = StyleSheet.create({
     overlay: {
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
     },
     modal: {
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 24,
          width: "80%",
          maxWidth: 300,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 8,
     },
     title: {
          fontSize: 18,
          fontWeight: "bold",
          color: "#2c3e50",
          marginBottom: 12,
          textAlign: "center",
     },
     message: {
          fontSize: 16,
          color: "#7f8c8d",
          marginBottom: 24,
          textAlign: "center",
          lineHeight: 24,
     },
     buttonContainer: {
          flexDirection: "row",
          justifyContent: "space-between",
     },
     button: {
          flex: 1,
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 8,
          marginHorizontal: 4,
     },
     cancelButton: {
          backgroundColor: "#95a5a6",
     },
     confirmButton: {
          backgroundColor: "#e74c3c",
     },
     cancelButtonText: {
          color: "#fff",
          fontSize: 16,
          fontWeight: "600",
          textAlign: "center",
     },
     confirmButtonText: {
          color: "#fff",
          fontSize: 16,
          fontWeight: "600",
          textAlign: "center",
     },
});

export default ConfirmModal; 