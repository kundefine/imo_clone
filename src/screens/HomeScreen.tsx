import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BottomBar } from '../components/home/BottomBar';
import { ContactListItem } from '../components/home/ContactListItem';
import { StoriesRow } from '../components/home/StoriesRow';
import { TopBar } from '../components/home/TopBar';
import { Colors } from '../constants/colors';
import { ContactItem, StoryItem } from '../types';

type HomeScreenProps = {
  contacts: ContactItem[];
  stories: StoryItem[];
  hasMoreToLoad: boolean;
  onLoadMoreContacts: () => void;
  onSelectContact: (contact: ContactItem) => void;
  onOpenAddModal: () => void;
  onOpenManualAddModal: () => void;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({
  contacts,
  stories,
  hasMoreToLoad,
  onLoadMoreContacts,
  onSelectContact,
  onOpenAddModal,
  onOpenManualAddModal,
}) => {
  return (
    <View style={styles.container}>
      {/* 1:1 Matching Imo Start Top Bar */}
      <TopBar onOpenAddModal={onOpenAddModal} />

      {/* Contact List using performant FlatList */}
      <FlatList
        style={styles.list}
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ContactListItem
            contact={item}
            onPress={() => onSelectContact(item)}
          />
        )}
        ListHeaderComponent={<StoriesRow stories={stories} />}
        ListFooterComponent={
          hasMoreToLoad ? (
            <View style={styles.lazyLoadFooter}>
              <ActivityIndicator size="small" color={Colors.imoBlue} />
              <Text style={styles.lazyLoadText}>Loading more contacts...</Text>
            </View>
          ) : (
            <View style={{ height: 16 }} />
          )
        }
        onEndReached={onLoadMoreContacts}
        onEndReachedThreshold={0.4}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Imo Fixed Bottom Bar (+ on left, Search on right) */}
      <BottomBar
        onAddPress={onOpenManualAddModal}
        onSearchPress={onOpenAddModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  list: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  lazyLoadFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  lazyLoadText: {
    color: '#8A9099',
    fontSize: 13,
  },
});
