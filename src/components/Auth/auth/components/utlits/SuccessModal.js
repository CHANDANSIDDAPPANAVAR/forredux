// SuccessModal.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
} from 'react-native';

const SuccessModal = ({visible, onClose}) => {
  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Image
            source={require('./assets/sussessfuly.png')}
            style={styles.sussimg}
          />
          <Text style={styles.modalTitle}>Registration Successful</Text>
          <Text style={styles.modalText}>Welcome to You Connectry!</Text>
          <TouchableOpacity onPress={onClose} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
  },
  sussimg: {
    width: 60,
    height: 60,
  },
  modalTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#4CAF50',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SuccessModal;
