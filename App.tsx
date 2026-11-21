import { FontAwesome5 } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
import { ArrowLeft, Check, MoreVertical, Plus, Search, UserPlus, X } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ImageSourcePropType,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

const initialContacts = require('./db/contact.json') as ContactItem[];
const initialConversations = require('./db/conversations.json') as ConversationThread[];

type StoryItem = {
  id: string;
  name: string;
  image?: ImageSourcePropType;
  plus?: boolean;
};

type ContactItem = {
  id: string;
  name: string;
  subtitle: string;
  subtitleType?: 'missed_call' | 'emoji' | 'audio' | 'video_canceled' | 'normal';
  date: string;
  avater?: string;
  imageUri?: string;
  isDefaultAvatar?: boolean;
  verifiedBadge?: boolean;
  icon: 'phone' | 'chevron';
};

type DeviceContactItem = {
  id: string;
  name: string;
  phone?: string;
  imageUri?: string;
};

type ConversationItem =
  | {
    id: string;
    type: 'date';
    label: string;
  }
  | {
    id: string;
    type: 'text';
    sender: 'me' | 'them';
    text: string;
    time: string;
    isPhone?: boolean;
    showAvatar?: boolean;
  }
  | {
    id: string;
    type: 'image';
    sender: 'me' | 'them';
    time: string;
    caption: string;
    imageTone: 'paper' | 'portrait';
    showAvatar?: boolean;
  }
  | {
    id: string;
    type: 'call';
    sender: 'me' | 'them';
    title: string;
    subtitle: string;
    time: string;
    callTone: 'missed' | 'done' | 'video' | 'canceled';
    showAvatar?: boolean;
  };

type ConversationThread = {
  contactId: string;
  lastSeen: string;
  messages: ConversationItem[];
};

const reactionEmojis = ['😡', '😭', '😩', '🥲', '👻', '😞', '😘', '💕'];
const reactionDiceSource: ImageSourcePropType = require('./assets/apk/reaction_first_icon.png');
const senderAvatarSource: ImageSourcePropType = require('./assets/avater/sender_me_clean.png');

const avatarSources: Record<string, ImageSourcePropType> = {
  '../assets/avater/contact_musu_khala.png': require('./assets/avater/contact_musu_khala.png'),
  '../assets/avater/contact_ronzu.png': require('./assets/avater/contact_ronzu.png'),
  '../assets/avater/jorna_avatar.png': require('./assets/avater/jorna_avatar.png'),
  '../assets/avater/contact_makon.png': require('./assets/avater/contact_makon.png'),
  '../assets/avater/contact_kamrul.png': require('./assets/avater/contact_kamrul.png'),
  '../assets/avater/contact_sumaiya.png': require('./assets/avater/contact_sumaiya.png'),
  '../assets/avater/sender_me_clean.png': senderAvatarSource,
  '../assets/avater/story_porosh.png': require('./assets/avater/story_porosh.png'),
  '../assets/avater/story_planet.png': require('./assets/avater/story_planet.png'),
};

const stories: StoryItem[] = [
  { id: 's1', name: 'Story', plus: true },
  { id: 's2', name: 'পরশ', image: require('./assets/avater/story_porosh.png') },
  { id: 's3', name: 'Planet', image: require('./assets/avater/story_planet.png') },
];

/* SVG Icons for Start Screen */
function TopBarChatIcon() {
  return (
    <Svg width={27} height={27} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 11.5C20 16.19 16.19 20 11.5 20C10.05 20 8.68 19.64 7.48 18.99L3 20.2L4.25 15.82C3.47 14.54 3 13.07 3 11.5C3 6.81 6.81 3 11.5 3C16.19 3 20 6.81 20 11.5Z"
        fill="#00A3FF"
      />
      <Path d="M7.5 10H15.5M7.5 13.5H12.5" stroke="#0E0F12" strokeWidth="1.9" strokeLinecap="round" />
    </Svg>
  );
}

function MissedCallIcon({ size = 15, color = '#FF5A52' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16 4L7 13M7 13H12M7 13V8"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21 16.5v2.8a1.8 1.8 0 0 1-1.96 1.8 17.8 17.8 0 0 1-7.77-2.76 17.5 17.5 0 0 1-5.4-5.4A17.8 17.8 0 0 1 3.1 5.17 1.8 1.8 0 0 1 4.9 3.2h2.8a1.8 1.8 0 0 1 1.8 1.55 11.5 11.5 0 0 0 .63 2.53 1.8 1.8 0 0 1-.4 1.9L8.55 10.36a14.4 14.4 0 0 0 5.4 5.4l1.18-1.18a1.8 1.8 0 0 1 1.9-.4 11.5 11.5 0 0 0 2.53.63 1.8 1.8 0 0 1 1.44 1.69z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function AudioSubtitleIcon({ size = 14, color = '#8E949B' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="8" y="2" width="8" height="12" rx="4" stroke={color} strokeWidth="1.9" />
      <Path d="M4 10C4 14.4 7.6 18 12 18C16.4 18 20 14.4 20 10" stroke={color} strokeWidth="1.9" strokeLinecap="round" />
      <Path d="M12 18V22M8 22H16" stroke={color} strokeWidth="1.9" strokeLinecap="round" />
    </Svg>
  );
}

function VideoSubtitleIcon({ size = 15, color = '#8E949B' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="5" width="13" height="14" rx="3" stroke={color} strokeWidth="1.9" />
      <Path d="M15 10L21 6V18L15 14" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function GreenCheckBadge() {
  return (
    <View style={styles.verifiedBadge}>
      <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
        <Path d="M5 13L9 17L19 7" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </View>
  );
}

/* SVG Helpers for Conversation Screen */
function VideoCallIcon({ size = 20, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 6.5C3 5.12 4.12 4 5.5 4H14.5C15.88 4 17 5.12 17 6.5V17.5C17 18.88 15.88 20 14.5 20H5.5C4.12 20 3 18.88 3 17.5V6.5Z"
        fill={color}
      />
      <Path
        d="M17 10.2L20.5 7.7C21.1 7.27 22 7.7 22 8.44V15.56C22 16.3 21.1 16.73 20.5 16.3L17 13.8V10.2Z"
        fill={color}
      />
    </Svg>
  );
}

function CanceledVideoIcon({ size = 20, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 6.5C3 5.12 4.12 4 5.5 4H14.5C15.88 4 17 5.12 17 6.5V17.5C17 18.88 15.88 20 14.5 20H5.5C4.12 20 3 18.88 3 17.5V6.5Z"
        fill={color}
      />
      <Path
        d="M17 10.2L20.5 7.7C21.1 7.27 22 7.7 22 8.44V15.56C22 16.3 21.1 16.73 20.5 16.3L17 13.8V10.2Z"
        fill={color}
      />
      <Path
        d="M7.5 14.5L12.5 9.5M12.5 9.5H8.8M12.5 9.5V13.2"
        stroke="#033B5E"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function BubbleTailMine({ color = '#035587' }: { color?: string }) {
  return (
    <View style={styles.tailMinePosition}>
      <Svg width={8} height={12} viewBox="0 0 8 12">
        <Path d="M0 0 Q6 1 8 0 C5 3 2 8 0 12 Z" fill={color} />
      </Svg>
    </View>
  );
}

function BubbleTailTheirs({ color = '#282A2F' }: { color?: string }) {
  return (
    <View style={styles.tailTheirsPosition}>
      <Svg width={8} height={12} viewBox="0 0 8 12">
        <Path d="M8 0 Q2 1 0 0 C3 3 6 8 8 12 Z" fill={color} />
      </Svg>
    </View>
  );
}

function OpenSmileIcon({ size = 24, color = '#9AA0A6' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="1.9" />
      <Circle cx="8.8" cy="9.8" r="1.2" fill={color} />
      <Circle cx="15.2" cy="9.8" r="1.2" fill={color} />
      <Path
        d="M7.8 13.5C8.3 16.2 10.8 17.5 12 17.5C13.2 17.5 15.7 16.2 16.2 13.5H7.8Z"
        stroke={color}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function GalleryIcon({ size = 22, color = '#B8BDC3' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3.5" y="3.5" width="17" height="17" rx="4.5" stroke={color} strokeWidth="1.9" />
      <Circle cx="8.5" cy="8.5" r="1.5" fill={color} />
      <Path
        d="M20.5 16.2L15.5 11.2L5 20.5"
        stroke={color}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CirclePlusIcon({ size = 22, color = '#B8BDC3' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="1.9" />
      <Path d="M12 7.5V16.5M7.5 12H16.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function MicIcon({ size = 22, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="8.5" y="3.5" width="7" height="11.5" rx="3.5" fill={color} />
      <Path
        d="M5 10.5C5 14.36 8.13 17.5 12 17.5C15.87 17.5 19 14.36 19 10.5"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <Path d="M12 17.5V21.5M8.5 21.5H15.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  );
}

/* Sample device contacts for testing lazy-loading */
function getFallbackRawDeviceContacts(): any[] {
  const names = [
    'Abdur Rahim', 'Babul Akter', 'Chowdhury Hasan', 'Dilara Begum',
    'Enamul Haque', 'Faisal Karim', 'Golam Rabbani', 'Habibullah Misbah',
    'Ismail Hossain', 'Jahangir Alam', 'Kazi Nazrul', 'Liton Das',
    'Mahmudullah Riyad', 'Nasir Hossain', 'Omar Faruk', 'Parvez Emon',
    'Quazi Motahar', 'Rafiqul Islam', 'Shakib Khan', 'Tamim Iqbal',
    'Upoma Sen', 'Wahiduzzaman', 'Yeasin Arafat', 'Zakir Hasan',
    'Anika Tabassum', 'Biplob Kumar', 'Dipu Moni', 'Emon Mahmud',
    'Faruk Ahmed', 'Gazi Salahuddin', 'Hasan Mahmud', 'Iqbal Bahar'
  ];

  return names.map((name, i) => ({
    id: `dev-fb-${i + 1}`,
    name,
    phoneNumbers: [{ number: `+880 17${10 + i}-${100000 + i * 37}` }],
  }));
}

export default function App() {
  const [contactsList, setContactsList] = useState<ContactItem[]>(initialContacts);
  const [importedContacts, setImportedContacts] = useState<ContactItem[]>([]);
  const [loadedImportedCount, setLoadedImportedCount] = useState(20);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);

  const [conversationsList, setConversationsList] = useState<ConversationThread[]>(initialConversations);
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');

  /* Manual Contact Creation Modal State */
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [showManualForm, setShowManualForm] = useState(false);
  const [contactSearchText, setContactSearchText] = useState('');

  /* Automatic Single-Time Permission & Contact Import on App Launch */
  useEffect(() => {
    let isMounted = true;

    async function autoImport() {
      try {
        setIsLoadingContacts(true);
        // Request contact permission automatically on first launch
        const { status } = await Contacts.requestPermissionsAsync();

        if (status === 'granted') {
          const { data } = await Contacts.getContactsAsync({
            fields: [
              Contacts.Fields.Name,
              Contacts.Fields.PhoneNumbers,
              Contacts.Fields.Image,
            ],
            sort: Contacts.SortTypes.FirstName,
          });

          if (isMounted) {
            const raw = (data && data.length > 0) ? (data as any[]) : getFallbackRawDeviceContacts();
            const mapped: ContactItem[] = raw.map((c, idx) => {
              const name =
                c.name ||
                [c.firstName, c.lastName].filter(Boolean).join(' ') ||
                `Contact ${idx + 1}`;
              const phone = c.phoneNumbers?.[0]?.number || '+880 1700-000000';
              const hasImage = !!((c.imageAvailable && c.image?.uri) || c.imageUri);
              const imageUri = (c.imageAvailable && c.image?.uri) || c.imageUri || undefined;

              return {
                id: `device-${c.id || idx}`,
                name,
                subtitle: phone,
                subtitleType: 'normal',
                date: '',
                imageUri,
                isDefaultAvatar: !hasImage,
                icon: 'phone',
              };
            });

            setImportedContacts(mapped);
          }
        } else {
          // If permission not granted, populate fallback list so user still sees default avatar contacts
          if (isMounted) {
            const fallbackMapped: ContactItem[] = getFallbackRawDeviceContacts().map((c, idx) => ({
              id: `device-${c.id || idx}`,
              name: c.name,
              subtitle: c.phoneNumbers?.[0]?.number || '+880 1700-000000',
              subtitleType: 'normal',
              date: '',
              isDefaultAvatar: true,
              icon: 'phone',
            }));
            setImportedContacts(fallbackMapped);
          }
        }
      } catch (err) {
        console.warn('Auto import contacts error:', err);
        if (isMounted) {
          const fallbackMapped: ContactItem[] = getFallbackRawDeviceContacts().map((c, idx) => ({
            id: `device-${c.id || idx}`,
            name: c.name,
            subtitle: c.phoneNumbers?.[0]?.number || '+880 1700-000000',
            subtitleType: 'normal',
            date: '',
            isDefaultAvatar: true,
            icon: 'phone',
          }));
          setImportedContacts(fallbackMapped);
        }
      } finally {
        if (isMounted) setIsLoadingContacts(false);
      }
    }

    autoImport();
    return () => {
      isMounted = false;
    };
  }, []);

  /* Combine all contacts for search and conversation navigation */
  const allContacts = useMemo(
    () => [...contactsList, ...importedContacts],
    [contactsList, importedContacts]
  );

  /* Display contacts: Initial contacts at TOP, imported device contacts at BOTTOM (Lazy loaded first 20, +20 on scroll) */
  const displayedContacts = useMemo(() => {
    const visibleImported = importedContacts.slice(0, loadedImportedCount);
    return [...contactsList, ...visibleImported];
  }, [contactsList, importedContacts, loadedImportedCount]);

  const hasMoreToLoad = importedContacts.length > loadedImportedCount;

  /* Lazy Load on Scroll */
  const handleLoadMoreContacts = () => {
    if (hasMoreToLoad) {
      setLoadedImportedCount((prev) => Math.min(prev + 20, importedContacts.length));
    }
  };

  const activeContact = useMemo(
    () => allContacts.find((item) => item.id === activeContactId) ?? null,
    [allContacts, activeContactId]
  );

  const activeConversation = useMemo(() => {
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

  /* Manual Add Contact */
  const handleAddManualContact = () => {
    if (!manualName.trim()) {
      Alert.alert('Name Required', 'Please enter a contact name.');
      return;
    }

    const newContact: ContactItem = {
      id: `c-${Date.now()}`,
      name: manualName.trim(),
      subtitle: manualPhone.trim() || 'imo Friend',
      subtitleType: 'normal',
      date: 'Just now',
      isDefaultAvatar: true,
      icon: 'phone',
    };

    setContactsList((prev) => [...prev, newContact]);

    setManualName('');
    setManualPhone('');
    setShowManualForm(false);
    setIsImportModalVisible(false);
    Alert.alert('Contact Added', `${newContact.name} has been added with default avatar.`);
  };

  /* Filter Device Contacts for manual modal picker */
  const filteredDeviceContacts = useMemo(() => {
    if (!contactSearchText.trim()) return importedContacts;
    const q = contactSearchText.toLowerCase();
    return importedContacts.filter((c) => {
      const name = c.name.toLowerCase();
      const phone = c.subtitle.toLowerCase();
      return name.includes(q) || phone.includes(q);
    });
  }, [importedContacts, contactSearchText]);

  /* Contact Subtitle Renderer matching imo_start.jpeg */
  const renderSubtitle = (contact: ContactItem) => {
    if (contact.subtitleType === 'missed_call') {
      return (
        <View style={styles.subtitleRow}>
          <MissedCallIcon />
          <Text style={styles.subtitleMissedText}>{contact.subtitle}</Text>
        </View>
      );
    }

    if (contact.subtitleType === 'emoji') {
      return (
        <View style={styles.subtitleRow}>
          <Text style={styles.subtitleHeartText}>{contact.subtitle}</Text>
        </View>
      );
    }

    if (contact.subtitleType === 'audio') {
      return (
        <View style={styles.subtitleRow}>
          <AudioSubtitleIcon />
          <Text style={styles.subtitleMutedText}>{contact.subtitle}</Text>
        </View>
      );
    }

    if (contact.subtitleType === 'video_canceled') {
      return (
        <View style={styles.subtitleRow}>
          <VideoSubtitleIcon />
          <Text style={styles.subtitleMutedText}>{contact.subtitle}</Text>
        </View>
      );
    }

    return (
      <View style={styles.subtitleRow}>
        <Text style={styles.subtitleMutedText}>{contact.subtitle}</Text>
      </View>
    );
  };

  /* Contact Avatar with default avatar fallback & verified badge */
  const renderContactAvatar = (contact: ContactItem, size: number = 58) => {
    if (contact.imageUri) {
      return (
        <View style={[styles.contactAvatarWrap, { width: size, height: size }]}>
          <Image
            source={{ uri: contact.imageUri }}
            style={[styles.contactPhotoAvatar, { width: size, height: size, borderRadius: size / 2 }]}
          />
          {contact.verifiedBadge && <GreenCheckBadge />}
        </View>
      );
    }

    if (contact.isDefaultAvatar || !contact.avater) {
      return (
        <View style={[styles.contactAvatarWrap, { width: size, height: size }]}>
          <View
            style={[
              styles.defaultSilhouetteAvatar,
              { width: size, height: size, borderRadius: size / 2 },
            ]}
          >
            <FontAwesome5 name="user" solid size={Math.round(size * 0.48)} color="#8A8F98" />
          </View>
          {contact.verifiedBadge && <GreenCheckBadge />}
        </View>
      );
    }

    const source = contact.avater ? avatarSources[contact.avater] : undefined;

    return (
      <View style={[styles.contactAvatarWrap, { width: size, height: size }]}>
        {source ? (
          <Image
            source={source}
            style={[styles.contactPhotoAvatar, { width: size, height: size, borderRadius: size / 2 }]}
          />
        ) : (
          <View
            style={[
              styles.defaultSilhouetteAvatar,
              { width: size, height: size, borderRadius: size / 2 },
            ]}
          >
            <FontAwesome5 name="user" solid size={Math.round(size * 0.48)} color="#8A8F98" />
          </View>
        )}
        {contact.verifiedBadge && <GreenCheckBadge />}
      </View>
    );
  };

  const renderConversation = () => {
    if (!activeContact) {
      return null;
    }

    const messages = activeConversation?.messages ?? [];
    const lastSeen = activeConversation?.lastSeen ?? 'Last seen recently';

    return (
      <View style={styles.conversationContainer}>
        {/* Header - EXACT 1:1 matching imo_conversation_design.jpeg */}
        <View style={styles.chatHeader}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.chatHeaderBack}
            onPress={() => setActiveContactId(null)}
          >
            <ArrowLeft color="#FFFFFF" size={24} strokeWidth={2.4} />
          </TouchableOpacity>

          <View style={styles.chatHeaderCenter}>
            <Text style={styles.chatHeaderTitle} numberOfLines={1}>
              {activeContact.name}
            </Text>
            <Text style={styles.chatHeaderSubtitle} numberOfLines={1}>
              {lastSeen}
            </Text>
          </View>

          <View style={styles.chatHeaderActions}>
            <TouchableOpacity activeOpacity={0.7} style={styles.headerActionBtn}>
              <FontAwesome5 name="phone-alt" size={19} color="#00A3FF" />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} style={styles.headerActionBtn}>
              <FontAwesome5 name="video" size={19} color="#00A3FF" solid />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} style={styles.headerActionBtn}>
              <MoreVertical color="#FFFFFF" size={24} strokeWidth={2.4} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Message Thread */}
        <ScrollView
          style={styles.chatScroll}
          contentContainerStyle={styles.chatScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyChatWrap}>
              {renderContactAvatar(activeContact, 72)}
              <Text style={styles.emptyChatName}>{activeContact.name}</Text>
              <Text style={styles.emptyChatSubtitle}>{activeContact.subtitle}</Text>
              <View style={styles.emptyChatWave}>
                <Text style={styles.emptyChatWaveText}>Say hello to start chatting 👋</Text>
              </View>
            </View>
          ) : (
            messages.map((item) => {
              if (item.type === 'date') {
                return (
                  <View key={item.id} style={styles.dateBadgeWrap}>
                    <View style={styles.dateBadge}>
                      <Text style={styles.dateBadgeText}>{item.label}</Text>
                    </View>
                  </View>
                );
              }

              const mine = item.sender === 'me';
              const showAvatar = item.showAvatar !== false;

              if (item.type === 'call') {
                return (
                  <View
                    key={item.id}
                    style={[
                      styles.messageRow,
                      mine ? styles.messageRowMine : styles.messageRowTheirs,
                    ]}
                  >
                    {!mine && (
                      <View style={styles.avatarColumn}>
                        {showAvatar ? (
                          renderContactAvatar(activeContact, 36)
                        ) : (
                          <View style={styles.avatarPlaceholder} />
                        )}
                      </View>
                    )}

                    <View style={styles.bubbleWrapper}>
                      {showAvatar && (mine ? <BubbleTailMine color="#035587" /> : <BubbleTailTheirs color="#282A2F" />)}

                      <View
                        style={[
                          styles.callCard,
                          mine ? styles.callCardMine : styles.callCardTheirs,
                          !showAvatar && (mine ? styles.bubbleNoTailMine : styles.bubbleNoTailTheirs),
                        ]}
                      >
                        <View style={styles.callCardContent}>
                          <View
                            style={[
                              styles.callIconCircle,
                              item.callTone === 'missed'
                                ? styles.callIconCircleMissed
                                : styles.callIconCircleDark,
                            ]}
                          >
                            {item.callTone === 'missed' ? (
                              <FontAwesome5 name="video" size={17} color="#FFFFFF" solid />
                            ) : item.callTone === 'canceled' ? (
                              <CanceledVideoIcon size={20} color="#FFFFFF" />
                            ) : (
                              <VideoCallIcon size={20} color="#FFFFFF" />
                            )}
                          </View>

                          <View style={styles.callBody}>
                            <Text style={styles.callTitle}>{item.title}</Text>
                            <Text
                              style={[
                                styles.callSubtitle,
                                mine ? styles.callSubtitleMine : styles.callSubtitleTheirs,
                              ]}
                            >
                              {item.subtitle}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.callFooter}>
                          <Text
                            style={[
                              styles.callTime,
                              mine ? styles.callTimeMine : styles.callTimeTheirs,
                            ]}
                          >
                            {item.time}
                          </Text>
                          {mine && <View style={styles.messageSeenRing} />}
                        </View>
                      </View>
                    </View>

                    {mine && (
                      <View style={styles.avatarColumn}>
                        {showAvatar ? (
                          <Image source={senderAvatarSource} style={styles.senderAvatarImg} />
                        ) : (
                          <View style={styles.avatarPlaceholder} />
                        )}
                      </View>
                    )}
                  </View>
                );
              }

              if (item.type === 'text') {
                return (
                  <View
                    key={item.id}
                    style={[
                      styles.messageRow,
                      mine ? styles.messageRowMine : styles.messageRowTheirs,
                    ]}
                  >
                    {!mine && (
                      <View style={styles.avatarColumn}>
                        {showAvatar ? (
                          renderContactAvatar(activeContact, 36)
                        ) : (
                          <View style={styles.avatarPlaceholder} />
                        )}
                      </View>
                    )}

                    <View style={styles.bubbleWrapper}>
                      {showAvatar && (mine ? <BubbleTailMine color="#035587" /> : <BubbleTailTheirs color="#282A2F" />)}

                      <View
                        style={[
                          styles.textBubble,
                          mine ? styles.textBubbleMine : styles.textBubbleTheirs,
                          !showAvatar && (mine ? styles.bubbleNoTailMine : styles.bubbleNoTailTheirs),
                        ]}
                      >
                        <Text
                          style={[
                            styles.messageText,
                            item.isPhone && styles.messagePhoneText,
                          ]}
                        >
                          {item.text}
                        </Text>

                        <View style={styles.textMetaRow}>
                          <Text
                            style={[
                              styles.messageTime,
                              mine ? styles.callTimeMine : styles.callTimeTheirs,
                            ]}
                          >
                            {item.time}
                          </Text>
                          {mine && <View style={styles.messageSeenRing} />}
                        </View>
                      </View>
                    </View>

                    {mine && (
                      <View style={styles.avatarColumn}>
                        {showAvatar ? (
                          <Image source={senderAvatarSource} style={styles.senderAvatarImg} />
                        ) : (
                          <View style={styles.avatarPlaceholder} />
                        )}
                      </View>
                    )}
                  </View>
                );
              }

              return null;
            })
          )}
        </ScrollView>

        {/* Quick Reaction Bar */}
        <View style={styles.reactionBar}>
          <TouchableOpacity activeOpacity={0.7} style={styles.reactionItem}>
            <Image source={reactionDiceSource} style={styles.reactionDice} resizeMode="contain" />
          </TouchableOpacity>
          {reactionEmojis.map((emoji, index) => (
            <TouchableOpacity key={index} activeOpacity={0.7} style={styles.reactionItem}>
              <Text style={styles.reactionEmojiText}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Message Composer */}
        <View style={styles.composerBar}>
          <View style={styles.composerInputWrap}>
            <TouchableOpacity activeOpacity={0.7} style={styles.composerSmileBtn}>
              <OpenSmileIcon size={25} color="#9AA0A6" />
            </TouchableOpacity>

            <TextInput
              style={styles.composerTextInput}
              placeholder="Message"
              placeholderTextColor="#8F949B"
              value={messageInput}
              onChangeText={setMessageInput}
            />

            <View style={styles.composerRightActions}>
              <TouchableOpacity activeOpacity={0.7} style={styles.composerActionIconBtn}>
                <GalleryIcon size={23} color="#B8BDC3" />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} style={styles.composerActionIconBtn}>
                <CirclePlusIcon size={23} color="#B8BDC3" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.8} style={styles.micCircleBtn}>
            <MicIcon size={23} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderStartScreen = () => (
    <>
      {/* Top Bar - 1:1 matching imo_start.jpeg */}
      <View style={styles.topBar}>
        <TouchableOpacity activeOpacity={0.8}>
          <Image source={senderAvatarSource} style={styles.topBarUserAvatar} />
        </TouchableOpacity>

        {/* Center Tab (Chats Tab) */}
        <View style={styles.topBarCenterTab}>
          <TopBarChatIcon />
          <View style={styles.tabIndicatorBar} />
        </View>

        {/* Right Menu Button with Green "1" Badge */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.topRightBtn}
          onPress={() => {
            setShowManualForm(false);
            setIsImportModalVisible(true);
          }}
        >
          <View style={styles.topRightUserWrap}>
            <FontAwesome5 name="user-alt" size={20} color="#B0B6BD" />
            <View style={styles.topRightLines}>
              <View style={styles.topRightLine} />
              <View style={styles.topRightLine} />
            </View>
          </View>
          <View style={styles.topRightBadge}>
            <Text style={styles.topRightBadgeText}>1</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Contact List using FlatList for performant lazy loading on scroll */}
      <FlatList
        data={displayedContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.id}
            style={styles.contactRow}
            activeOpacity={0.7}
            onPress={() => setActiveContactId(item.id)}
          >
            {renderContactAvatar(item)}

            <View style={styles.contactBody}>
              <Text style={styles.contactName} numberOfLines={1}>
                {item.name}
              </Text>
              {renderSubtitle(item)}
            </View>

            <View style={styles.contactMeta}>
              <Text style={styles.contactDate}>{item.date}</Text>
              <TouchableOpacity activeOpacity={0.7} style={styles.callIconBtn}>
                <FontAwesome5 name="phone-alt" size={17} color="#00A3FF" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListHeaderComponent={
          <>
            {/* Stories Row - 1:1 matching imo_start.jpeg */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.storyRow}
            >
              {stories.map((item) => (
                <View key={item.id} style={styles.storyItem}>
                  {item.plus ? (
                    <View style={styles.storyAddWrap}>
                      <View style={styles.storyAddCircle}>
                        <FontAwesome5 name="camera" size={24} color="#C4CAD1" />
                      </View>
                      <View style={styles.storyPlusBadge}>
                        <Plus color="#FFFFFF" size={16} strokeWidth={3} />
                      </View>
                    </View>
                  ) : (
                    <View style={styles.storyImageWrap}>
                      <Image source={item.image!} style={styles.storyImg} />
                    </View>
                  )}
                  <Text style={styles.storyLabel} numberOfLines={1}>
                    {item.name}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.listSeparator} />
          </>
        }
        ListFooterComponent={
          hasMoreToLoad ? (
            <View style={styles.lazyLoadFooter}>
              <ActivityIndicator size="small" color="#00A3FF" />
              <Text style={styles.lazyLoadText}>Loading more contacts...</Text>
            </View>
          ) : (
            <View style={{ height: 76 }} />
          )
        }
        onEndReached={handleLoadMoreContacts}
        onEndReachedThreshold={0.4}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Floating Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.bottomActionBtn}
          onPress={() => {
            setShowManualForm(true);
            setIsImportModalVisible(true);
          }}
        >
          <Plus color="#00A3FF" size={30} strokeWidth={2.4} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} style={styles.bottomActionBtn}>
          <Search color="#00A3FF" size={26} strokeWidth={2.4} />
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#16171B" />
      <View style={styles.screen}>
        {activeContactId ? renderConversation() : renderStartScreen()}
      </View>

      {/* Contact Import / Add Modal */}
      <Modal
        visible={isImportModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsImportModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleWrap}>
                <UserPlus color="#00A3FF" size={22} strokeWidth={2.2} />
                <Text style={styles.modalHeaderTitle}>Add Contacts</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.modalCloseBtn}
                onPress={() => setIsImportModalVisible(false)}
              >
                <X color="#9AA0A6" size={22} strokeWidth={2.2} />
              </TouchableOpacity>
            </View>

            {/* Mode Selector */}
            <View style={styles.modalTabs}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.modalTabBtn, !showManualForm && styles.modalTabBtnActive]}
                onPress={() => setShowManualForm(false)}
              >
                <Text style={[styles.modalTabText, !showManualForm && styles.modalTabTextActive]}>
                  Phone Contacts
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.modalTabBtn, showManualForm && styles.modalTabBtnActive]}
                onPress={() => setShowManualForm(true)}
              >
                <Text style={[styles.modalTabText, showManualForm && styles.modalTabTextActive]}>
                  Manual Add
                </Text>
              </TouchableOpacity>
            </View>

            {showManualForm ? (
              /* Manual Add Form */
              <View style={styles.manualFormContainer}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. Shakib Al Hasan"
                  placeholderTextColor="#727780"
                  value={manualName}
                  onChangeText={setManualName}
                />

                <Text style={[styles.inputLabel, { marginTop: 14 }]}>Phone Number</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. +880 1712-345678"
                  placeholderTextColor="#727780"
                  keyboardType="phone-pad"
                  value={manualPhone}
                  onChangeText={setManualPhone}
                />

                <View style={styles.defaultAvatarNote}>
                  <View style={styles.defaultMiniAvatar}>
                    <FontAwesome5 name="user" solid size={14} color="#8A8F98" />
                  </View>
                  <Text style={styles.defaultAvatarNoteText}>
                    Will be added with imo's default profile avatar
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.addSubmitBtn}
                  onPress={handleAddManualContact}
                >
                  <Check color="#FFFFFF" size={20} strokeWidth={2.5} />
                  <Text style={styles.addSubmitBtnText}>Add to Contacts</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* Device Contacts List */
              <>
                <View style={styles.modalSearchWrap}>
                  <Search color="#8F949B" size={18} strokeWidth={2.2} />
                  <TextInput
                    style={styles.modalSearchInput}
                    placeholder="Search phone contacts..."
                    placeholderTextColor="#727780"
                    value={contactSearchText}
                    onChangeText={setContactSearchText}
                  />
                  {contactSearchText.length > 0 && (
                    <TouchableOpacity onPress={() => setContactSearchText('')}>
                      <X color="#727780" size={16} />
                    </TouchableOpacity>
                  )}
                </View>

                {isLoadingContacts ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#00A3FF" />
                    <Text style={styles.loadingText}>Reading phone contacts...</Text>
                  </View>
                ) : (
                  <ScrollView
                    style={styles.deviceContactsScroll}
                    contentContainerStyle={styles.deviceContactsScrollContent}
                    showsVerticalScrollIndicator={false}
                  >
                    {filteredDeviceContacts.length === 0 ? (
                      <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No matching contacts found</Text>
                      </View>
                    ) : (
                      filteredDeviceContacts.map((c) => (
                        <TouchableOpacity
                          key={c.id}
                          style={styles.deviceContactRow}
                          activeOpacity={0.7}
                          onPress={() => {
                            setActiveContactId(c.id);
                            setIsImportModalVisible(false);
                          }}
                        >
                          <View style={styles.deviceContactAvatar}>
                            {renderContactAvatar(c, 44)}
                          </View>

                          <View style={styles.deviceContactInfo}>
                            <Text style={styles.deviceContactName}>{c.name}</Text>
                            <Text style={styles.deviceContactPhone}>{c.subtitle}</Text>
                          </View>

                          <View style={styles.deviceAddPill}>
                            <Text style={styles.deviceAddPillText}>Chat</Text>
                          </View>
                        </TouchableOpacity>
                      ))
                    )}
                  </ScrollView>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#16171B',
  },
  screen: {
    flex: 1,
    backgroundColor: '#0E0F12',
  },
  conversationContainer: {
    flex: 1,
    backgroundColor: '#0E0F12',
  },

  /* Start Screen Top Bar */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 6 : 10,
    paddingBottom: 4,
    backgroundColor: '#16171B',
  },
  topBarUserAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  topBarCenterTab: {
    alignItems: 'center',
    flex: 1,
    paddingTop: 4,
  },
  tabIndicatorBar: {
    width: 140,
    height: 3,
    backgroundColor: '#00A3FF',
    marginTop: 8,
    borderRadius: 1.5,
  },
  topRightBtn: {
    width: 44,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  topRightUserWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topRightLines: {
    marginLeft: 3,
    gap: 3,
  },
  topRightLine: {
    width: 5,
    height: 2,
    backgroundColor: '#B0B6BD',
    borderRadius: 1,
  },
  topRightBadge: {
    position: 'absolute',
    top: 0,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#4CD964',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#16171B',
  },
  topRightBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },

  /* Story Carousel */
  scrollContent: {
    paddingBottom: 76,
  },
  storyRow: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  storyItem: {
    width: 86,
    marginRight: 10,
    alignItems: 'center',
  },
  storyAddWrap: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyAddCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#26282E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyPlusBadge: {
    position: 'absolute',
    right: 0,
    bottom: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#00A3FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#0E0F12',
  },
  storyImageWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: 'hidden',
  },
  storyImg: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  storyLabel: {
    marginTop: 8,
    color: '#E4E7EB',
    fontSize: 13,
    fontWeight: '500',
  },
  listSeparator: {
    height: 1,
    backgroundColor: '#1E2026',
  },

  /* Contact List Rows */
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#17181D',
  },
  contactAvatarWrap: {
    position: 'relative',
    width: 58,
    height: 58,
  },
  contactPhotoAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  defaultSilhouetteAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#444851',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    width: 19,
    height: 19,
    borderRadius: 9.5,
    backgroundColor: '#3DD448',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0E0F12',
  },
  contactBody: {
    flex: 1,
    marginLeft: 15,
    marginRight: 10,
    justifyContent: 'center',
  },
  contactName: {
    color: '#FFFFFF',
    fontSize: 16.5,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 5,
  },
  subtitleMissedText: {
    color: '#FF5A52',
    fontSize: 13,
    fontWeight: '400',
  },
  subtitleHeartText: {
    fontSize: 13,
    lineHeight: 16,
  },
  subtitleMutedText: {
    color: '#8E949B',
    fontSize: 13,
    fontWeight: '400',
  },
  contactMeta: {
    width: 60,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 46,
  },
  contactDate: {
    color: '#8E949B',
    fontSize: 11.5,
    fontWeight: '400',
  },
  callIconBtn: {
    padding: 2,
  },
  lazyLoadFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  lazyLoadText: {
    color: '#8E949B',
    fontSize: 13,
  },

  /* Bottom Floating Action Bar */
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 58,
    backgroundColor: '#0E0F12',
    paddingHorizontal: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomActionBtn: {
    padding: 8,
  },

  /* Contact Import Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E2026',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 18,
    paddingBottom: 24,
    paddingHorizontal: 18,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalHeaderTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalTabs: {
    flexDirection: 'row',
    backgroundColor: '#141519',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  modalTabBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 9,
  },
  modalTabBtnActive: {
    backgroundColor: '#00A3FF',
  },
  modalTabText: {
    color: '#8E949B',
    fontSize: 14,
    fontWeight: '600',
  },
  modalTabTextActive: {
    color: '#FFFFFF',
  },
  modalSearchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141519',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 14,
    gap: 8,
  },
  modalSearchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
  },
  deviceContactsScroll: {
    maxHeight: 380,
  },
  deviceContactsScrollContent: {
    paddingBottom: 10,
  },
  deviceContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#282B33',
  },
  deviceContactAvatar: {
    width: 44,
    height: 44,
    marginRight: 12,
  },
  deviceContactInfo: {
    flex: 1,
  },
  deviceContactName: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '600',
  },
  deviceContactPhone: {
    color: '#8E949B',
    fontSize: 12.5,
    marginTop: 2,
  },
  deviceAddPill: {
    backgroundColor: '#00A3FF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  deviceAddPillText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  manualFormContainer: {
    paddingVertical: 6,
  },
  inputLabel: {
    color: '#D1D5DB',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: '#141519',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    color: '#FFFFFF',
    fontSize: 15,
  },
  defaultAvatarNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    backgroundColor: '#171920',
    padding: 12,
    borderRadius: 12,
    gap: 10,
  },
  defaultMiniAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#444851',
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultAvatarNoteText: {
    color: '#8E949B',
    fontSize: 12.5,
    flex: 1,
  },
  addSubmitBtn: {
    backgroundColor: '#00A3FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 25,
    marginTop: 22,
    gap: 8,
  },
  addSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#8E949B',
    fontSize: 14,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#727780',
    fontSize: 14,
  },

  /* Conversation Screen Styles */
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 6 : 10,
    paddingBottom: 12,
    backgroundColor: '#16171B',
    borderBottomWidth: 1,
    borderBottomColor: '#202227',
  },
  chatHeaderBack: {
    padding: 6,
    marginRight: 6,
  },
  chatHeaderCenter: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  chatHeaderSubtitle: {
    color: '#8E949B',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '400',
  },
  chatHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    paddingRight: 6,
  },
  headerActionBtn: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatScroll: {
    flex: 1,
    backgroundColor: '#0E0F12',
  },
  chatScrollContent: {
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 14,
  },
  emptyChatWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  emptyChatName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
  },
  emptyChatSubtitle: {
    color: '#8E949B',
    fontSize: 14,
    marginTop: 4,
  },
  emptyChatWave: {
    marginTop: 24,
    backgroundColor: '#1E2026',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  emptyChatWaveText: {
    color: '#00A3FF',
    fontSize: 14,
    fontWeight: '600',
  },
  dateBadgeWrap: {
    alignItems: 'center',
    marginVertical: 12,
  },
  dateBadge: {
    backgroundColor: '#2A2D34',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  dateBadgeText: {
    color: '#CCD0D5',
    fontSize: 12,
    fontWeight: '500',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 3,
  },
  messageRowMine: {
    justifyContent: 'flex-end',
  },
  messageRowTheirs: {
    justifyContent: 'flex-start',
  },
  avatarColumn: {
    width: 36,
    height: 36,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
  },
  senderAvatarImg: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  bubbleWrapper: {
    position: 'relative',
    marginHorizontal: 8,
  },
  tailMinePosition: {
    position: 'absolute',
    top: 0,
    right: -7,
    zIndex: 2,
  },
  tailTheirsPosition: {
    position: 'absolute',
    top: 0,
    left: -7,
    zIndex: 2,
  },
  callCard: {
    width: 275,
    paddingHorizontal: 15,
    paddingTop: 13,
    paddingBottom: 10,
  },
  callCardMine: {
    backgroundColor: '#035587',
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    borderTopRightRadius: 3,
  },
  callCardTheirs: {
    backgroundColor: '#282A2F',
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderTopLeftRadius: 3,
  },
  bubbleNoTailMine: {
    borderTopRightRadius: 18,
  },
  bubbleNoTailTheirs: {
    borderTopLeftRadius: 18,
  },
  callCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  callIconCircleMissed: {
    backgroundColor: '#3FD63C',
  },
  callIconCircleDark: {
    backgroundColor: '#033B5E',
  },
  callBody: {
    flex: 1,
  },
  callTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  callSubtitle: {
    fontSize: 12,
    marginTop: 3,
  },
  callSubtitleTheirs: {
    color: '#9E9E9E',
  },
  callSubtitleMine: {
    color: '#8CB5D3',
  },
  callFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  callTime: {
    fontSize: 11,
  },
  callTimeMine: {
    color: '#8CB5D3',
  },
  callTimeTheirs: {
    color: '#8E949B',
  },
  messageSeenRing: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#00A3FF',
    marginLeft: 5,
  },
  textBubble: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    minWidth: 100,
    maxWidth: 260,
  },
  textBubbleMine: {
    backgroundColor: '#035587',
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    borderTopRightRadius: 3,
  },
  textBubbleTheirs: {
    backgroundColor: '#282A2F',
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderTopLeftRadius: 3,
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
  },
  messagePhoneText: {
    color: '#1CB0FF',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  textMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 11,
  },
  reactionBar: {
    backgroundColor: '#111215',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  reactionItem: {
    width: 35,
    height: 35,
    borderRadius: 10,
    backgroundColor: '#212328',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reactionDice: {
    width: 25,
    height: 25,
  },
  reactionEmojiText: {
    fontSize: 19,
    textAlign: 'center',
  },
  composerBar: {
    backgroundColor: '#111215',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 12,
  },
  composerInputWrap: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#222429',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  composerSmileBtn: {
    padding: 2,
    marginRight: 8,
  },
  composerTextInput: {
    flex: 1,
    height: '100%',
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 0,
  },
  composerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginLeft: 6,
  },
  composerActionIconBtn: {
    padding: 2,
  },
  micCircleBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00A3FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
});
