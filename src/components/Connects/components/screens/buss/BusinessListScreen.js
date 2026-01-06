import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Image,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import api from '../../../../../services/api.js';
import { resolveMediaUrl } from '../../../../../services/mediaUrl.js';

const PAGE_LIMIT = 10;

const BusinessListScreen = () => {
  const { accessToken } = useSelector(state => state.auth);
  const [following, setFollowing] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();

  const resolveImageUrl = url => {
    if (!url) return null;
    return resolveMediaUrl(url);
  };

  const fetchFollowing = async (pageToFetch = 1, isRefresh = false) => {
    try {
      const res = await api.get(
        `/api/business/list-following?page=${pageToFetch}&limit=${PAGE_LIMIT}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      const newData = res.data.following || [];
      const sorted = [...newData].sort((a, b) => a.name.localeCompare(b.name));

      if (isRefresh) {
        setFollowing(sorted);
      } else {
        setFollowing(prev => [...prev, ...sorted]);
      }

      setHasMore(newData.length === PAGE_LIMIT);
    } catch (error) {
      console.error('❌ Failed to fetch following:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  const handleOpenChat = (userId, name, profile_image) => {
    navigation.navigate('ChatScreen', {
      recipientId: userId,
      recipientName: name,
      recipientImage: profile_image,
    });
  };
  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      setLoading(true);
      await fetchFollowing(1, true);

      if (!cancelled) {
        setLoading(false);
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  const handleOpenProfile = userId => {
    navigation.navigate('Connects', {
      screen: 'ConnectBussopen',
      params: { userId },
    });
  };

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleOpenProfile(item.following_id)}
      >
        <Image
          source={
            item.profile_image
              ? { uri: resolveImageUrl(item.profile_image) }
              : require('../../../../assets/choseaccount/assets/noprofile.png')
          }
          style={styles.avatar}
        />
        <View style={styles.dataandchat}>
          <View style={styles.info}>
            <Text style={styles.name}>
              {item.name?.length > 20
                ? item.name.slice(0, 20) + '…'
                : item.name}
            </Text>
            {item.namelocation && (
              <Text style={styles.location}>
                {item.namelocation.length > 20
                  ? item.namelocation.slice(0, 20) + '…'
                  : item.namelocation}
              </Text>
            )}
          </View>
          <View style={styles.chatthing}>
            <TouchableOpacity
              onPress={() =>
                handleOpenChat(item.following_id, item.name, item.profile_image)
              }
            >
              <Image
                source={require('../../../assets/chat.png')}
                style={styles.chatimg}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [],
  );

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => {
        const nextPage = prev + 1;
        fetchFollowing(nextPage);
        return nextPage;
      });
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchFollowing(1, true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffffff' }}>
      {loading && page === 1 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#444" />
        </View>
      ) : (
        <FlatList
          data={following}
          keyExtractor={item => item.following_id?.toString()}
          renderItem={renderItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{
            padding: 16,
            paddingBottom: Platform.OS === 'ios' ? 100 : 70,
          }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No connections found.</Text>
          }
          ListFooterComponent={
            hasMore ? (
              <ActivityIndicator
                size="small"
                color="#888"
                style={{ margin: 12 }}
              />
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
};

export default BusinessListScreen;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    padding: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(239, 239, 239, 1)',
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 12,
    marginRight: 14,
    borderWidth: 2,
    borderColor: '#d7d7d7ff',
    backgroundColor: '#F2F2F2',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  skills: {
    fontSize: 13,
    lineHeight: 15,
    fontFamily: 'Poppins-Regular',
    color: '#777',
  },
  tapHint: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    fontFamily: 'Poppins-Italic',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#aaa',
    fontFamily: 'Poppins-Regular',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
  },
  chatimg: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    tintColor: 'rgba(6, 6, 6, 0.9)',
  },
  dataandchat: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
