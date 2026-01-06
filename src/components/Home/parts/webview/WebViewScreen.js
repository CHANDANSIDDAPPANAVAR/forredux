import React from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
const WebViewScreen = ({ route }) => {
  const { url } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <WebView source={{ uri: url }} startInLoadingState={true} />
    </SafeAreaView>
  );
};

export default WebViewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
