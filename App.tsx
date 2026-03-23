import { FontAwesome5 } from '@expo/vector-icons';
import { Camera, ChatBubble, ChatLines, NavArrowRight } from 'iconoir-react-native';
import { ArrowLeft, Image as ImageIcon, MoreVertical, Plus, Search, Smile, Video } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Platform, StatusBar } from 'react-native';
import {
  Image,
  ImageSourcePropType,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const contacts = require('./db/contact.json') as ContactItem[];
const conversations = require('./db/conversations.json') as ConversationThread[];

type StoryItem = {
  id: string;
  name: string;
  accent?: string;
  badge?: string;
  plus?: boolean;
  marketplace?: boolean;
};

type ContactItem = {
  id: string;
  name: string;
  subtitle: string;
  date: string;
  avater?: string;
  accent?: string;
  icon: 'phone' | 'chevron';
  subtitleTone?: 'normal' | 'muted' | 'danger' | 'emoji';
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
    }
  | {
      id: string;
      type: 'image';
      sender: 'me' | 'them';
      time: string;
      caption: string;
      imageTone: 'paper' | 'portrait';
    }
  | {
      id: string;
      type: 'call';
      sender: 'me' | 'them';
      title: string;
      subtitle: string;
      time: string;
      callTone: 'missed' | 'done';
    };

type ConversationThread = {
  contactId: string;
  lastSeen: string;
  messages: ConversationItem[];
};

const stories: StoryItem[] = [
  { id: 's1', name: 'Add a story', accent: '#37393D', plus: true },
  { id: 's2', name: 'Almain - S...', accent: '#2D8ACB', badge: '1' },
  { id: 's3', name: 'Planet', accent: '#8E9E59', badge: 'FOF' },
  { id: 's4', name: 'Marketpla..', marketplace: true },
];

const reactions = ['🎲', '😡', '😭', '😩', '🥲', '👻', '😞', '😘', '💕'];

const avatarSources: Record<string, ImageSourcePropType> = {
  '../assets/avater/deepaknaik-soniya-bansal-8065649.jpg': require('./assets/avater/deepaknaik-soniya-bansal-8065649.jpg'),
  '../assets/avater/ghostw1997-aodai-6004289.jpg': require('./assets/avater/ghostw1997-aodai-6004289.jpg'),
  '../assets/avater/hiteshhtsharma-srishti-textile-9876622.jpg': require('./assets/avater/hiteshhtsharma-srishti-textile-9876622.jpg'),
  '../assets/avater/rachealmarie-ai-generated-8626079_1920.jpg': require('./assets/avater/rachealmarie-ai-generated-8626079_1920.jpg'),
  '../assets/avater/raheel9630-aditi-rao-hydari-1748439_1920.jpg': require('./assets/avater/raheel9630-aditi-rao-hydari-1748439_1920.jpg'),
  '../assets/avater/raheel9630-priyanka-chopra-1748203_1920.jpg': require('./assets/avater/raheel9630-priyanka-chopra-1748203_1920.jpg'),
};

function CircleAvatar({
  label,
  accent,
  size = 64,
}: {
  label: string;
  accent: string;
  size?: number;
}) {
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: accent,
        },
      ]}
    >
      <Text style={[styles.avatarText, size < 60 && styles.avatarTextSmall]}>
        {label}
      </Text>
    </View>
  );
}

function ContactAvatar({
  contact,
  size = 64,
}: {
  contact: ContactItem;
  size?: number;
}) {
  const source = contact.avater ? avatarSources[contact.avater] : undefined;

  if (source) {
    return (
      <Image
        source={source}
        style={[
          styles.photoAvatar,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      />
    );
  }

  return (
    <CircleAvatar
      label={contact.name.slice(0, 1)}
      accent={contact.accent || '#5F6670'}
      size={size}
    />
  );
}

function StoryAvatar({ item }: { item: StoryItem }) {
  if (item.plus) {
    return (
      <View style={styles.addStoryWrap}>
        <View style={styles.addStoryCircle}>
          <Camera color="#818890" width={24} height={24} strokeWidth={2.2} />
        </View>
        <View style={styles.plusBadge}>
          <Plus color="#FFFFFF" size={16} strokeWidth={2.4} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.storyAvatarWrap}>
      {item.marketplace ? (
        <View style={styles.marketplaceRing}>
          <View style={styles.marketplaceInner}>
            <ChatBubble color="#0A9CFF" width={24} height={24} strokeWidth={2.2} />
            <Text style={styles.marketplaceBottom}>imo</Text>
          </View>
        </View>
      ) : (
        <View style={[styles.storyRing, item.id === 's3' && styles.storyRingGreen]}>
          <CircleAvatar label={item.name.slice(0, 1)} accent={item.accent || '#4B8ACB'} size={70} />
        </View>
      )}
      {item.badge ? (
        <View style={styles.storyBadge}>
          <Text style={styles.storyBadgeText}>{item.badge}</Text>
        </View>
      ) : null}
    </View>
  );
}

function renderSubtitleTone(
  tone: ContactItem['subtitleTone'],
  subtitle: string
) {
  if (tone === 'emoji') {
    return <Text style={styles.contactSubtitleEmoji}>♥</Text>;
  }

  return (
    <Text
      style={[
        styles.contactSubtitle,
        tone === 'muted' && styles.contactSubtitleMuted,
        tone === 'danger' && styles.contactSubtitleDanger,
      ]}
      numberOfLines={1}
    >
      {subtitle}
    </Text>
  );
}

export default function App() {
  const [activeContactId, setActiveContactId] = useState<string | null>(null);

  const activeContact = useMemo(
    () => contacts.find((item) => item.id === activeContactId) ?? null,
    [activeContactId]
  );
  const activeConversation = useMemo(
    () => conversations.find((item) => item.contactId === activeContactId) ?? null,
    [activeContactId]
  );

  const renderConversation = () => {
    if (!activeContact) {
      return null;
    }

    const messages = activeConversation?.messages ?? [];
    const lastSeen = activeConversation?.lastSeen ?? 'Last seen recently';

    return (
      <>
        <View style={styles.chatHeader}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.chatHeaderBack}
            onPress={() => setActiveContactId(null)}
          >
            <ArrowLeft color="#FFFFFF" size={32} strokeWidth={2.2} />
          </TouchableOpacity>

          <View style={styles.chatHeaderCenter}>
            <Text style={styles.chatHeaderTitle}>{activeContact.name}</Text>
            <Text style={styles.chatHeaderSubtitle}>{lastSeen}</Text>
          </View>

          <View style={styles.chatHeaderActions}>
            <FontAwesome5 name="phone-alt" size={20} color="#08A4FF" solid />
            <Video color="#08A4FF" size={24} strokeWidth={2.5} />
            <MoreVertical color="#FFFFFF" size={22} strokeWidth={2.2} />
          </View>
        </View>

        <ScrollView
          style={styles.chatScroll}
          contentContainerStyle={styles.chatScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((item) => {
            if (item.type === 'date') {
              return (
                <View key={item.id} style={styles.dateBadge}>
                  <Text style={styles.dateBadgeText}>{item.label}</Text>
                </View>
              );
            }

            if (item.type === 'text') {
              const mine = item.sender === 'me';
              return (
                <View
                  key={item.id}
                  style={[styles.messageRow, mine ? styles.messageRowMine : styles.messageRowTheirs]}
                >
                  {!mine ? (
                    <ContactAvatar contact={activeContact} size={44} />
                  ) : null}

                  <View
                    style={[
                      styles.messageBubbleWrap,
                      mine ? styles.bubbleContainerMine : styles.messageBubbleWrapTheirs,
                    ]}
                  >
                    <View
                      style={[
                        styles.messageBubble,
                        mine ? styles.messageBubbleMine : styles.messageBubbleTheirs,
                      ]}
                    >
                    <Text style={styles.messageText}>{item.text}</Text>
                      <View style={styles.messageMetaRow}>
                        <Text style={styles.messageTime}>{item.time}</Text>
                        <View style={styles.messageSeenDot} />
                      </View>
                    </View>
                  </View>

                  {mine ? (
                    <View style={styles.sentAvatarWrap}>
                  <CircleAvatar label="S" accent="#BDEBDD" size={30} />
                    </View>
                  ) : null}
                </View>
              );
            }

            if (item.type === 'call') {
              const mine = item.sender === 'me';
              return (
                <View
                  key={item.id}
                  style={[styles.messageRow, mine ? styles.messageRowMine : styles.messageRowTheirs]}
                >
                  {!mine ? (
                    <ContactAvatar contact={activeContact} size={44} />
                  ) : null}

                  <View
                    style={[
                      styles.callCardWrap,
                      mine ? styles.bubbleContainerMine : styles.callCardWrapTheirs,
                    ]}
                  >
                    <View
                      style={[
                        styles.callCard,
                        mine ? styles.callCardMine : styles.callCardTheirs,
                      ]}
                    >
                      <View style={styles.callCardContent}>
                        <View
                          style={[
                            styles.callIconCircle,
                            item.callTone === 'missed'
                              ? styles.callIconCircleMissed
                              : styles.callIconCircleDone,
                          ]}
                        >
                          <Video color="#FFFFFF" size={18} strokeWidth={2.4} />
                        </View>
                        <View style={styles.callBody}>
                          <Text style={styles.callTitle}>{item.title}</Text>
                          <Text style={styles.callSubtitle}>{item.subtitle}</Text>
                        </View>
                      </View>
                      <View style={styles.callFooter}>
                        <Text style={styles.callTime}>{item.time}</Text>
                        {mine ? <View style={styles.messageSeenDot} /> : null}
                      </View>
                    </View>
                  </View>

                  {mine ? (
                    <View style={styles.sentAvatarWrap}>
                      <CircleAvatar label="S" accent="#BDEBDD" size={30} />
                    </View>
                  ) : null}
                </View>
              );
            }

            const mine = item.sender === 'me';
            return (
              <View
                key={item.id}
                style={[styles.messageRow, mine ? styles.messageRowMine : styles.messageRowTheirs]}
              >
                {!mine ? (
                  <ContactAvatar contact={activeContact} size={44} />
                ) : null}

                <View
                  style={[
                    styles.imageCardWrap,
                    mine ? styles.bubbleContainerMine : styles.imageCardWrapTheirs,
                  ]}
                >
                  <View style={[styles.imageCard, mine ? styles.imageCardMine : styles.imageCardTheirs]}>
                    <View
                      style={[
                        styles.imageMock,
                        item.imageTone === 'portrait' ? styles.imageMockPortrait : styles.imageMockPaper,
                      ]}
                    >
                      <Text style={styles.imageMockLabel}>{item.caption}</Text>
                    </View>
                    <View style={styles.imageMetaRow}>
                      <Text style={styles.messageTime}>{item.time}</Text>
                      <View style={styles.messageSeenDot} />
                    </View>
                  </View>
                </View>

                {mine ? (
                  <View style={styles.sentAvatarWrap}>
                    <CircleAvatar label="S" accent="#BDEBDD" size={30} />
                  </View>
                ) : null}
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.reactionBar}>
          {reactions.map((reaction) => (
            <Text key={reaction} style={styles.reactionItem}>
              {reaction}
            </Text>
          ))}
        </View>

        <View style={styles.composerBar}>
          <View style={styles.composerInput}>
            <Smile color="#A0A4AA" size={26} strokeWidth={2.1} />
            <Text style={styles.composerPlaceholder}>Message</Text>
            <View style={styles.composerActions}>
              <ImageIcon color="#A0A4AA" size={24} strokeWidth={2.1} />
              <Plus color="#A0A4AA" size={24} strokeWidth={2.1} />
            </View>
          </View>

          <View style={styles.micButton}>
            <Text style={styles.micText}>🎤</Text>
          </View>
        </View>
      </>
    );
  };

  const renderContacts = () => (
    <>
      <View style={styles.topBar}>
        <CircleAvatar label="S" accent="#BDEBDD" size={46} />

        <View style={styles.centerIconWrap}>
          <View style={styles.centerIconBubble}>
            <ChatLines color="#0A9CFF" width={26} height={26} strokeWidth={2.4} />
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.8} style={styles.menuWrap}>
          <View style={styles.headerMenuIcon}>
            <FontAwesome5
              name="user-alt"
              size={25}
              color="#C5CCD3"
              style={styles.headerMenuUser}
            />
            <View style={styles.headerMenuList}>
              <View style={styles.headerMenuLine} />
              <View style={styles.headerMenuLine} />
              <View style={styles.headerMenuLine} />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.tabTrack}>
        <View style={styles.tabIndicator} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storyRow}
        >
          {stories.map((item) => (
            <View key={item.id} style={styles.storyItem}>
              <StoryAvatar item={item} />
              <Text style={styles.storyLabel} numberOfLines={1}>
                {item.name}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.divider} />

        {contacts.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.contactRow}
            activeOpacity={0.82}
            onPress={() => setActiveContactId(item.id)}
          >
            {item.name === 'imo Team' ? (
              <View style={styles.teamAvatar}>
                <Text style={styles.teamAvatarText}>imo</Text>
              </View>
            ) : (
              <ContactAvatar contact={item} size={62} />
            )}

            <View style={styles.contactBody}>
              <Text style={styles.contactName} numberOfLines={1}>
                {item.name}
              </Text>
              {renderSubtitleTone(item.subtitleTone, item.subtitle)}
            </View>

            <View style={styles.contactMeta}>
              <Text style={styles.contactDate}>{item.date}</Text>
              {item.icon === 'chevron' ? (
                <NavArrowRight color="#727780" width={18} height={18} strokeWidth={2.2} />
              ) : (
                <FontAwesome5 name="phone-alt" size={18} color="#00A0FF" solid />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity activeOpacity={0.8}>
          <Plus color="#00A0FF" size={34} strokeWidth={2.1} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8}>
          <Search color="#00A0FF" size={28} strokeWidth={2.2} />
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1F23" />
      <View style={styles.screen}>
        {activeContactId ? renderConversation() : renderContacts()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#1E1F23',
  },
  screen: {
    flex: 1,
    backgroundColor: '#1E1F23',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 6 : 10,
    paddingBottom: 12,
  },
  centerIconWrap: {
    flex: 1,
    alignItems: 'center',
  },
  centerIconBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuWrap: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerMenuIcon: {
    width: 38,
    height: 30,
    position: 'relative',
  },
  headerMenuUser: {
    position: 'absolute',
    left: 0,
    top: 1,
  },
  headerMenuList: {
    position: 'absolute',
    right: 0,
    top: 7,
    justifyContent: 'center',
    gap: 3,
  },
  headerMenuLine: {
    width: 7,
    height: 2,
    borderRadius: 2,
    backgroundColor: '#C5CCD3',
  },
  tabTrack: {
    height: 3,
    backgroundColor: '#303238',
  },
  tabIndicator: {
    width: 170,
    height: 3,
    marginLeft: 122,
    backgroundColor: '#0A9CFF',
  },
  scrollContent: {
    paddingBottom: 88,
  },
  storyRow: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 18,
  },
  storyItem: {
    width: 92,
    marginRight: 8,
    alignItems: 'center',
  },
  addStoryWrap: {
    width: 78,
    height: 78,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addStoryCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#303238',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusBadge: {
    position: 'absolute',
    right: 0,
    bottom: 4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#0A9CFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#1E1F23',
  },
  storyAvatarWrap: {
    width: 78,
    height: 78,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyRing: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 3,
    borderColor: '#17A8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyRingGreen: {
    borderColor: '#6FC44B',
  },
  marketplaceRing: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 3,
    borderColor: '#17A8FF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F5F7',
  },
  marketplaceInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F7FA',
  },
  marketplaceBottom: {
    marginTop: 1,
    color: '#0A9CFF',
    fontSize: 15,
    fontWeight: '700',
  },
  storyBadge: {
    position: 'absolute',
    top: 0,
    right: -2,
    minWidth: 30,
    height: 30,
    borderRadius: 15,
    paddingHorizontal: 6,
    backgroundColor: '#61D34C',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1E1F23',
  },
  storyBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  storyLabel: {
    marginTop: 10,
    color: '#F1F3F5',
    fontSize: 12,
    fontWeight: '500',
    maxWidth: 96,
  },
  divider: {
    height: 1,
    backgroundColor: '#32343A',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#32343A',
  },
  contactBody: {
    flex: 1,
    marginLeft: 16,
    marginRight: 10,
  },
  contactName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  contactSubtitle: {
    marginTop: 4,
    color: '#AAB0B7',
    fontSize: 11,
    fontWeight: '400',
  },
  contactSubtitleMuted: {
    color: '#9CA2AA',
  },
  contactSubtitleDanger: {
    color: '#FF5A52',
  },
  contactSubtitleEmoji: {
    marginTop: 4,
    color: '#FF4D4D',
    fontSize: 16,
    lineHeight: 18,
  },
  contactMeta: {
    width: 72,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  contactDate: {
    color: '#A8ADB4',
    fontSize: 10,
    fontWeight: '400',
    marginBottom: 10,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 72,
    backgroundColor: '#1E1F23',
    borderTopWidth: 1,
    borderTopColor: '#32343A',
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photoAvatar: {
    backgroundColor: '#303238',
  },
  teamAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E7EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamAvatarText: {
    color: '#12A2FF',
    fontSize: 22,
    fontWeight: '700',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  avatarTextSmall: {
    fontSize: 18,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 4 : 8,
    paddingBottom: 12,
    backgroundColor: '#1E1F23',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2B31',
  },
  chatHeaderBack: {
    width: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatHeaderCenter: {
    flex: 1,
    marginLeft: 6,
  },
  chatHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  chatHeaderSubtitle: {
    color: '#8E949B',
    fontSize: 12,
    marginTop: 3,
  },
  chatHeaderActions: {
    width: 120,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatScroll: {
    flex: 1,
    backgroundColor: '#101114',
  },
  chatScrollContent: {
    paddingHorizontal: 10,
    paddingTop: 14,
    paddingBottom: 10,
  },
  dateBadge: {
    alignSelf: 'center',
    backgroundColor: '#3A3B40',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 7,
    marginVertical: 10,
  },
  dateBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  messageRowMine: {
    justifyContent: 'flex-end',
  },
  messageRowTheirs: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: 250,
    minWidth: 136,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  messageBubbleWrap: {
    position: 'relative',
    marginHorizontal: 8,
  },
  bubbleContainerMine: {
    position: 'relative',
    marginHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  messageBubbleWrapMine: {
    marginRight: 2,
  },
  messageBubbleWrapTheirs: {},
  messageBubbleMine: {
    backgroundColor: '#045D94',
    borderWidth: 1,
    borderColor: '#0C6FAE',
    borderTopRightRadius: 2,
  },
  messageBubbleTheirs: {
    backgroundColor: '#2E2C2D',
  },
  sentAvatarWrap: {
    marginLeft: 14,
    marginTop: -2,
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
  },
  messageMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  messageTime: {
    color: '#A9B2B7',
    fontSize: 10,
  },
  messageSeenDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#11A4FF',
    marginLeft: 6,
  },
  imageCardWrap: {
    position: 'relative',
    marginHorizontal: 8,
  },
  imageCardWrapMine: {
    marginRight: 2,
  },
  imageCardWrapTheirs: {},
  imageCard: {
    width: 272,
    borderRadius: 26,
    padding: 6,
  },
  imageCardMine: {
    backgroundColor: '#045D94',
    borderWidth: 1,
    borderColor: '#0C6FAE',
    borderTopRightRadius: 2,
  },
  imageCardTheirs: {
    backgroundColor: '#2E2C2D',
  },
  imageMock: {
    borderRadius: 22,
    height: 330,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  imageMockPaper: {
    backgroundColor: '#9C8450',
  },
  imageMockPortrait: {
    backgroundColor: '#88DDF2',
  },
  imageMockLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  imageMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 4,
  },
  callCardWrap: {
    position: 'relative',
    marginHorizontal: 8,
  },
  callCardWrapMine: {
    marginRight: 2,
  },
  callCardWrapTheirs: {},
  callCard: {
    width: 258,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopRightRadius: 2,
  },
  callCardMine: {
    backgroundColor: '#045D94',
    borderWidth: 1,
    borderColor: '#0C6FAE',
  },
  callCardTheirs: {
    backgroundColor: '#2E2C2D',
  },
  callCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  callIconCircleMissed: {
    backgroundColor: '#57D654',
  },
  callIconCircleDone: {
    backgroundColor: '#0D3553',
  },
  callBody: {
    flex: 1,
  },
  callTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  callSubtitle: {
    color: '#A9B2B7',
    fontSize: 11,
    marginTop: 4,
  },
  callFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  callTime: {
    color: '#A9B2B7',
    fontSize: 11,
  },
  reactionBar: {
    backgroundColor: '#101114',
    paddingHorizontal: 10,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reactionItem: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#2A2B30',
    textAlign: 'center',
    lineHeight: 34,
    fontSize: 22,
  },
  composerBar: {
    backgroundColor: '#101114',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 12,
  },
  composerInput: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2A2B30',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  composerPlaceholder: {
    color: '#A0A4AA',
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  composerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  micButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#08A4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  micText: {
    fontSize: 26,
  },
});
