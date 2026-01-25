import React, { memo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { resolveMediaUrl } from '../../../../../services/mediaUrl';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 36) / 2;

/* ---------------- UTILITIES ---------------- */

const getFormattedSkill = skills => {
  if (!Array.isArray(skills) || skills.length === 0) return '';
  const first = skills[0];
  return typeof first === 'string'
    ? first.charAt(0).toUpperCase() + first.slice(1)
    : '';
};

/* ---------------- COMPONENT ---------------- */
const LocationList = memo(({ locations = [], loading, onLoadMore }) => {
  const navigation = useNavigation();
  const isLoadingMore = useRef(false);

  const renderItem = useCallback(
    ({ item }) => {
      if (!item) return null;

      const {
        user_id,
        name,
        selected_skills,
        profile_image,
        cover_image,
        distance,
        namelocation,
      } = item;

      return (
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.card}
          onPress={() =>
            navigation.navigate('Bussprofile', { userId: user_id })
          }
        >
          {cover_image ? (
            <Image
              source={{ uri: resolveMediaUrl(cover_image) }}
              style={styles.cover}
            />
          ) : (
            <View style={styles.coverFallback} />
          )}

          <Image
            source={
              profile_image
                ? { uri: resolveMediaUrl(profile_image) }
                : require('../../../../assets/choseaccount/assets/noprofile.png')
            }
            style={styles.avatar}
          />

          <View style={styles.content}>
            <Text style={styles.name} numberOfLines={2}>
              {name || 'Business'}
            </Text>

            {!!selected_skills && (
              <Text style={styles.skill} numberOfLines={1}>
                {getFormattedSkill(selected_skills)}
              </Text>
            )}

            <View style={styles.metaRow}>
              <Text style={styles.meta} numberOfLines={2}>
                📍 {namelocation || 'Nearby'}
              </Text>
              <Text style={styles.distance}>• {distance ?? 0} km</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [navigation],
  );

  const handleLoadMore = () => {
    if (loading || isLoadingMore.current) return;
    isLoadingMore.current = true;
    onLoadMore?.();
  };

  const resetLoadFlag = () => {
    isLoadingMore.current = false;
  };

  return (
    <FlatList
      data={locations}
      keyExtractor={item => String(item.user_id)}
      renderItem={renderItem}
      numColumns={2}
      columnWrapperStyle={styles.column}
      contentContainerStyle={{ padding: 12, paddingBottom: 120 }}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.2}
      onMomentumScrollEnd={resetLoadFlag}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews
      ListFooterComponent={
        loading ? <ActivityIndicator style={{ margin: 20 }} /> : null
      }
      ListEmptyComponent={
        !loading ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No locations found.</Text>
          </View>
        ) : null
      }
    />
  );
});

export default LocationList;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  column: {
    justifyContent: 'space-between',
  },

  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#edededff',
  },

  cover: {
    width: '100%',
    height: 90,
    backgroundColor: '#e5e7eb',
  },

  coverFallback: {
    width: '100%',
    height: 90,
    backgroundColor: '#eef2ff',
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 16,
    marginTop: -30,
    marginLeft: 20,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#e5e7eb',
  },

  content: {
    paddingLeft: 20,
    paddingRight: 12,
    paddingTop: 6,
    paddingBottom: 14,
  },

  name: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
  },

  skill: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#374151',
    marginTop: 2,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  meta: {
    fontSize: 11,
    color: '#6b7280',
    flexShrink: 1,
  },

  distance: {
    fontSize: 11,
    color: '#6b7280',
    marginLeft: 6,
  },

  emptyBox: {
    padding: 40,
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 15,
    color: '#888',
  },
});
