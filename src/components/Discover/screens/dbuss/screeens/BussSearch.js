import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

import LocationList from './Bussloctionlist';
import SearchHeader from '../../util/SearchHeader';
import { useBussSearch } from '../hooks/useBussSearch';

const BussSearch = () => {
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
  } = useBussSearch();

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
        <Text>Fetching nearby businesses…</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <SearchHeader
        value={searchQuery}
        placeholder="Search businesses"
        showBack={hasSearched}
        onBack={reset}
        onChangeText={setSearchQuery} // ✅ no auto reset
        onSubmit={search}
        onClear={() => (hasSearched ? reset() : setSearchQuery(''))}
      />

      <LocationList
        locations={locations}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />
    </View>
  );
};

export default BussSearch;

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
