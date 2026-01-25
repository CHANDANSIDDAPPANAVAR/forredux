import BackgroundFetch from 'react-native-background-fetch';

export const initBackgroundFetch = async onFetch => {
  await BackgroundFetch.configure(
    {
      minimumFetchInterval: 15, // iOS minimum
      stopOnTerminate: false,
      startOnBoot: true,
      enableHeadless: true,
    },

    // ✅ Background task
    async taskId => {
      try {
        await onFetch();
      } catch (e) {
        // silent fail (production safe)
      } finally {
        BackgroundFetch.finish(taskId); // 🔴 REQUIRED
      }
    },

    // ✅ Timeout handler (THIS REMOVES WARNING)
    async taskId => {
      BackgroundFetch.finish(taskId); // 🔴 REQUIRED
    },
  );

  await BackgroundFetch.start();
};
