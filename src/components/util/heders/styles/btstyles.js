import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },

  backBtn: {
    width: 40,
    justifyContent: 'center',
  },

  backText: {
    fontSize: 32,
    lineHeight: Platform.OS === 'ios' ? 32 : 36,
    color: '#111827',
    fontWeight: '400',
  },

  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: Platform.OS === 'ios' ? '600' : '700',
    color: '#111827',
  },

  rightSpace: {
    width: 40, // keeps title centered
  },
});
