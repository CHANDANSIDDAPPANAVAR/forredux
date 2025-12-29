import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)', // darker blur feel
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    width: '88%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 18,

    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },

    // Android shadow
    elevation: 10,
  },

  title: {
    fontSize: 19,
    fontWeight: Platform.OS === 'ios' ? '600' : '700',
    color: '#111',
    textAlign: 'center',
  },

  message: {
    marginTop: 10,
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    textAlign: 'center',
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
  },

  cancelBtn: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#F2F2F7', // iOS neutral gray
    alignItems: 'center',
  },

  cancelText: {
    fontSize: 15,
    color: '#444',
    fontWeight: '600',
  },

  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#FF3B30', // iOS destructive red
    alignItems: 'center',
  },

  confirmText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '700',
  },
});
