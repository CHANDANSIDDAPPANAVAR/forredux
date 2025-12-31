import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  subcontiner: {
    flex: 1,
    paddingBottom: 10,
  },

  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    padding: 16,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    margin: 14,
  },

  currentCard: {
    borderWidth: 1,
    borderColor: '#22C55E',
    backgroundColor: '#ECFDF5',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  leftCol: {
    flex: 1,
    paddingRight: 12,
  },

  rightCol: {
    alignItems: 'flex-end',
  },

  deviceText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
  },

  timeText: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    marginTop: 6,
  },

  badge: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9,
  },

  badgeText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },

  inlineLogoutBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },

  inlineLogoutText: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#EF4444',
  },

  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },

  primaryBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },

  primaryBtnText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },

  secondaryBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },

  secondaryBtnText: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#EF4444',
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  loadingText: {
    marginTop: 10,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },

  errorText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#EF4444',
  },
});
