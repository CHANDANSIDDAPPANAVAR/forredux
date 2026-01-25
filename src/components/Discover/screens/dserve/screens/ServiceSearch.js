import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

import ServiceLocationList from './ServiceLocationList';
import SearchHeader from '../../util/SearchHeader';
import { useServiceSearch } from '../hooks/useServiceSearch';

const ServiceSearch = () => {
  const {
    locations,
    userLocation,
    loading,
    hasMore,
    searchQuery,
    setSearchQuery,
    hasSearched,
    search,
    reset,
    loadMore,
  } = useServiceSearch();

  if (!userLocation) {
    return (
      <View style={styles.center}>
        <Text>Unable to fetch location</Text>
      </View>
    );
  }

  if (loading && locations.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5271ff" />
        <Text>Fetching nearby services…</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <SearchHeader
        value={searchQuery}
        placeholder="Search services"
        showBack={hasSearched}
        onBack={reset}
        onChangeText={setSearchQuery}
        onSubmit={search}
        onClear={() => (hasSearched ? reset() : setSearchQuery(''))}
      />

      <ServiceLocationList
        locations={locations}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />
    </View>
  );
};

export default ServiceSearch;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
