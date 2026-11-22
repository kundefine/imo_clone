import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { AddContactModal } from './src/components/modals/AddContactModal';
import { defaultStories } from './src/constants/assets';
import { Colors } from './src/constants/colors';
import { ConversationScreen } from './src/screens/ConversationScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { fetchDeviceContacts } from './src/services/contactsService';
import { ContactItem, ConversationItem, ConversationThread } from './src/types';

const initialContacts = require('./db/contact.json') as ContactItem[];
const initialConversations = require('./db/conversations.json') as ConversationThread[];

export default function App() {
  const [contactsList, setContactsList] = useState<ContactItem[]>(initialContacts);
  const [importedContacts, setImportedContacts] = useState<ContactItem[]>([]);
  const [loadedImportedCount, setLoadedImportedCount] = useState(20);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);

  const [conversationsList, setConversationsList] = useState<ConversationThread[]>(initialConversations);
  const [activeContactId, setActiveContactId] = useState<string | null>(null);

  // Modal State
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [initialShowManual, setInitialShowManual] = useState(false);

  // 1. Auto-import phone contacts on launch
  useEffect(() => {
    let isMounted = true;
    async function loadContacts() {
      setIsLoadingContacts(true);
      const contacts = await fetchDeviceContacts();
      if (isMounted) {
        setImportedContacts(contacts);
        setIsLoadingContacts(false);
      }
    }
    loadContacts();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Combine contacts for search & lookups
  const allContacts = useMemo(
    () => [...contactsList, ...importedContacts],
    [contactsList, importedContacts]
  );

  // 3. Display list: Top 8 mock contacts at TOP, imported device contacts at BOTTOM (Lazy loaded first 20, +20 on scroll)
  const displayedContacts = useMemo(() => {
    const visibleImported = importedContacts.slice(0, loadedImportedCount);
    return [...contactsList, ...visibleImported];
  }, [contactsList, importedContacts, loadedImportedCount]);

  const hasMoreToLoad = importedContacts.length > loadedImportedCount;

  const handleLoadMoreContacts = () => {
    if (hasMoreToLoad) {
      setLoadedImportedCount((prev) => Math.min(prev + 20, importedContacts.length));
    }
  };

  // 4. Active conversation & contact
  const activeContact = useMemo(
    () => allContacts.find((item) => item.id === activeContactId) ?? null,
    [allContacts, activeContactId]
  );

  const activeConversation = useMemo(() => {
    if (!activeContactId) return null;
    const existing = conversationsList.find((item) => item.contactId === activeContactId);
    if (existing) return existing;
    if (activeContact) {
      return {
        contactId: activeContact.id,
        lastSeen: 'Last seen recently',
        messages: [],
      };
    }
    return null;
  }, [conversationsList, activeContactId, activeContact]);

  // 5. Send message action
  const handleSendMessage = (text: string) => {
    if (!activeContactId) return;

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;

    const newMessage: ConversationItem = {
      id: `msg-${Date.now()}`,
      type: 'text',
      sender: 'me',
      text,
      time: timeString,
      showAvatar: true,
    };

    setConversationsList((prev) => {
      const idx = prev.findIndex((c) => c.contactId === activeContactId);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          messages: [...updated[idx].messages, newMessage],
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            contactId: activeContactId,
            lastSeen: 'Last seen recently',
            messages: [newMessage],
          },
        ];
      }
    });
  };

  // 6. Manual add contact
  const handleAddManualContact = (newContact: ContactItem) => {
    setContactsList((prev) => [...prev, newContact]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.headerDark} />
      <View style={styles.screen}>
        {activeContact ? (
          <ConversationScreen
            contact={activeContact}
            conversation={activeConversation}
            onBack={() => setActiveContactId(null)}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <HomeScreen
            contacts={displayedContacts}
            stories={defaultStories}
            hasMoreToLoad={hasMoreToLoad}
            onLoadMoreContacts={handleLoadMoreContacts}
            onSelectContact={(c) => setActiveContactId(c.id)}
            onOpenAddModal={() => {
              setInitialShowManual(false);
              setIsAddModalVisible(true);
            }}
            onOpenManualAddModal={() => {
              setInitialShowManual(true);
              setIsAddModalVisible(true);
            }}
          />
        )}
      </View>

      {/* Contact Import / Add Modal */}
      <AddContactModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        deviceContacts={importedContacts}
        isLoadingContacts={isLoadingContacts}
        onSelectContact={(c) => {
          setActiveContactId(c.id);
          setIsAddModalVisible(false);
        }}
        onAddManualContact={handleAddManualContact}
        initialShowManual={initialShowManual}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.headerDark,
  },
  screen: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
});
