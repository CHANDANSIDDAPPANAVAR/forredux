import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { resolveMediaUrl } from '../../../../../services/mediaUrl';

const { width } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_WIDTH = (width - CARD_GAP * 3) / 2;

const getFormattedSkill = (skills = []) => {
  if (!skills.length) return '';
  const first = skills[0];
  return first.charAt(0).toUpperCase() + first.slice(1);
};

const LocationList = ({ locations = [], loading, onLoadMore, hasMore }) => {
  const navigation = useNavigation();

  const renderItem = useCallback(
    ({ item }) => {
      const { profile_image, name, selected_skills, distance, user_id } = item;

      const imageSource = profile_image
        ? { uri: resolveMediaUrl(profile_image) }
        : require('../../../../assets/choseaccount/assets/noprofile.png');

      return (
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.card}
          onPress={() =>
            navigation.navigate('CreatorPublicProfile', { userId: user_id })
          }
        >
          <Image
            source={imageSource}
            style={styles.avatar}
            resizeMode="cover"
          />

          <View style={styles.cardBody}>
            <Text numberOfLines={1} style={styles.name}>
              {name}
            </Text>

            <Text numberOfLines={1} style={styles.meta}>
              {getFormattedSkill(selected_skills)}
              {distance != null ? ` • ${distance} km` : ''}
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [navigation],
  );

  if (!locations.length && !loading) {
    return (
      <View style={styles.emptyBox}>
        <Text style={styles.emptyText}>No creators found nearby</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={locations}
      keyExtractor={item => item.user_id?.toString()}
      renderItem={renderItem}
      numColumns={2}
      columnWrapperStyle={styles.column}
      contentContainerStyle={styles.listContent}
      onEndReached={hasMore ? onLoadMore : null}
      onEndReachedThreshold={0.4}
      ListFooterComponent={
        loading ? <ActivityIndicator style={{ marginVertical: 16 }} /> : null
      }
      showsVerticalScrollIndicator={false}
    />
  );
};

export default memo(LocationList);

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 100,
    paddingTop: 20,
    paddingHorizontal: CARD_GAP,
  },

  column: {
    justifyContent: 'space-between',
    marginBottom: CARD_GAP,
  },

  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fbfbfbff',
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#edededff',
    // iOS shadow
  },

  avatar: {
    width: '100%',
    height: 130,
    backgroundColor: '#f1f1f1',
  },

  cardBody: {
    padding: 12,
  },

  name: {
    fontSize: 15,
    fontWeight: Platform.OS === 'android' ? '600' : '700',
    color: '#1a1a1a',
  },

  meta: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },

  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },

  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
  },
});
