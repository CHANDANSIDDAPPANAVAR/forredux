import React, { memo, useRef, useCallback } from 'react';
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

const getFormattedSkill = skills => {
  if (!Array.isArray(skills) || skills.length === 0) return '';
  const first = skills[0];
  return first.charAt(0).toUpperCase() + first.slice(1);
};

const ServiceLocationList = memo(
  ({ locations = [], loading, onLoadMore, hasMore }) => {
    const navigation = useNavigation();
    const isLoadingMore = useRef(false);

    const renderItem = useCallback(
      ({ item }) => (
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.card}
          onPress={() =>
            navigation.navigate('Serviceopen', { userId: item.user_id })
          }
        >
          {item.cover_image ? (
            <Image
              source={{ uri: resolveMediaUrl(item.cover_image) }}
              style={styles.cover}
            />
          ) : (
            <View style={styles.coverFallback} />
          )}

          <Image
            source={
              item.profile_image
                ? { uri: resolveMediaUrl(item.profile_image) }
                : require('../../../../assets/choseaccount/assets/noprofile.png')
            }
            style={styles.avatar}
          />
          <View style={styles.contant}>
            <Text style={styles.name} numberOfLines={1}>
              {item.name || 'Service Provider'}
            </Text>

            {!!item.selected_skills && (
              <Text style={styles.skill} numberOfLines={1}>
                {getFormattedSkill(item.selected_skills)}
              </Text>
            )}

            <Text style={styles.meta} numberOfLines={1}>
              📍 {item.namelocation || 'Nearby'} • {item.distance ?? 0} km
            </Text>
          </View>
        </TouchableOpacity>
      ),
      [navigation],
    );

    const handleLoadMore = () => {
      if (!hasMore || loading || isLoadingMore.current) return;
      isLoadingMore.current = true;
      onLoadMore?.();
    };

    return (
      <FlatList
        data={locations}
        keyExtractor={item => String(item.user_id)}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ padding: 12, paddingBottom: 100 }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        onMomentumScrollEnd={() => (isLoadingMore.current = false)}
        ListFooterComponent={
          loading ? <ActivityIndicator style={{ margin: 20 }} /> : null
        }
        showsVerticalScrollIndicator={false}
      />
    );
  },
);

export default ServiceLocationList;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#f8f8f8ff',
    borderRadius: 16,
    marginBottom: 14,
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#edededff',
  },
  cover: {
    width: '100%',
    height: 110,
    backgroundColor: '#e5e7eb',
  },
  coverFallback: {
    width: '100%',
    height: 110,
    backgroundColor: '#eef2ff',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 18,
    marginTop: -32,
    marginBottom: 6,
    borderWidth: 3,
    borderColor: '#fff',
  },
  contant: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  skill: {
    fontSize: 12,
    color: '#6b7280',
  },
  meta: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 4,
  },
});
