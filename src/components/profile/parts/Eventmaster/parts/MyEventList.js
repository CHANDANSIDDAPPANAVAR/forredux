import React from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useMyEventActions } from '../hooks/useMyEventActions';

const MyEventList = ({ events, onRefresh }) => {
  console.log(events);
  const navigation = useNavigation();
  const { menuVisible, menuPosition, openMenu, closeMenu, confirmDelete } =
    useMyEventActions(onRefresh);

  const renderMenu = () => (
    <Modal transparent visible={menuVisible} animationType="fade">
      <Pressable style={styles.overlay} onPress={closeMenu}>
        <View
          style={[
            styles.dropdown,
            { top: menuPosition.y + 6, left: menuPosition.x - 80 },
          ]}
        >
          <TouchableOpacity onPress={confirmDelete}>
            <Text style={styles.dropdownItem}>Delete</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>
          Event ID: {item.title || item.event_id}
        </Text>
        <TouchableOpacity onPress={e => openMenu(item.event_id, e.nativeEvent)}>
          <Text style={styles.menu}>⋮</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() =>
            navigation.navigate('CreateEventScreen', {
              event_id: item.event_id,
            })
          }
        >
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() =>
            navigation.navigate('EventViewScreen', {
              event_id: item.event_id,
            })
          }
        >
          <Text style={styles.actionText}>View</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.date}>
        {item.created_at
          ? `Created on ${new Date(item.created_at).toLocaleDateString()}`
          : ''}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {renderMenu()}
      <FlatList
        data={events}
        keyExtractor={item => item.id?.toString() || item.event_id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No events created yet.</Text>
          </View>
        }
      />
    </View>
  );
};

export default MyEventList;
const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#f9f9f9',
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  menu: {
    fontSize: 20,
    padding: 10,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  actionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: '#000',
    borderRadius: 10,
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
  },
  date: {
    fontSize: 13,
    color: '#777',
    marginTop: 12,
    textAlign: 'right',
  },
  overlay: {
    flex: 1,
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    elevation: 8,
  },
  dropdownItem: {
    fontSize: 16,
    paddingVertical: 6,
  },
  empty: {
    marginTop: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
  },
});
