import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
  Linking,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ConnectTypesScreen from './utlits/ConnectTypesScreen';

const {width, height} = Dimensions.get('window');

const openCompanyWebsite = () => {
  Linking.openURL('https://tantratrack.com');
};

const RegisterTypeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.logoText}>YOU CONNECTRY</Text>
            <Text style={styles.logoSubtitle}>
              One Identity. Infinite Possibilities.
            </Text>
          </View>

          <ConnectTypesScreen />

          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Create an Account</Text>
            <Text style={styles.headerSubtitle}>Register with below</Text>
          </View>
        </View>

        {/* Main Buttons Section */}
        <View style={styles.btnMainContainer}>
          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={[styles.cardButton, styles.shadow]}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('Registerscreen')}>
              <Image
                source={require('./utlits/assets/Regicon.png')}
                style={styles.icon}
              />
              <Text style={styles.cardText}>Register to Connect</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.cardContainer}>
            <Text style={styles.alreadyAccountText}>
              Already have an account?
            </Text>
            <TouchableOpacity
              style={[styles.cardButton, styles.shadow]}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('Login')}>
              <Text style={styles.cardText}>Login to Connect</Text>
              <Image
                source={require('./utlits/assets/logicon.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Section */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={openCompanyWebsite}>
            <Text style={styles.footerText}>
              Powered by Tantra Track Private Limited
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
  },
  header: {
    width: '100%',
    backgroundColor: '#6A11CB',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingVertical: height * 0.04,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: {width: 0, height: 5},
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logoText: {
    color: '#F8FAFC',
    fontSize: width * 0.065,
    fontFamily: 'Poppins-Bold',
    lineHeight: 32,
  },
  logoSubtitle: {
    color: '#F8FAFC',
    fontSize: width * 0.04,
    fontFamily: 'Poppins-Regular',
    lineHeight: 20,
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: width * 0.07,
    fontFamily: 'Poppins-Bold',
    lineHeight: 32,
    marginTop: 5,
  },
  headerSubtitle: {
    color: '#e0dfff',
    fontSize: width * 0.04,
    fontFamily: 'Poppins-Regular',
    lineHeight: 22,
    marginTop: 4,
  },
  btnMainContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 30,
  },
  cardContainer: {
    width: '85%',
    marginVertical: 10,
    alignItems: 'center',
  },
  cardButton: {
    flexDirection: 'row',
    backgroundColor: '#8B46FF',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  cardText: {
    fontSize: width * 0.045,
    color: '#ffffff',
    fontFamily: 'Poppins-SemiBold',
    marginHorizontal: 6,
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: {width: 0, height: 5},
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  alreadyAccountText: {
    fontSize: width * 0.032,
    color: '#666680',
    fontFamily: 'Poppins-Regular',
    marginBottom: 5,
    textAlign: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '85%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB',
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: width * 0.035,
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: width * 0.028,
    textAlign: 'center',
    color: '#666680',
    fontFamily: 'Poppins-Regular',
  },
});

export default RegisterTypeScreen;
