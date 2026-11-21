import { FontAwesome5 } from '@expo/vector-icons';
import { Camera, ChatBubble, ChatLines, NavArrowRight } from 'iconoir-react-native';
import { ArrowLeft, MoreVertical, Plus, Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
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

const stories: StoryItem[] = [
  { id: 's1', name: 'Add a story', accent: '#37393D', plus: true },
  { id: 's2', name: 'Almain - S...', accent: '#2D8ACB', badge: '1' },
  { id: 's3', name: 'Planet', accent: '#8E9E59', badge: 'FOF' },
  { id: 's4', name: 'Marketpla..', marketplace: true },
];

const reactionEmojis = ['😡', '😭', '😩', '🥲', '👻', '😞', '😘', '💕'];
const reactionDiceSource: ImageSourcePropType = require('./assets/apk/reaction_first_icon.png');
const senderAvatarSource: ImageSourcePropType = require('./assets/avater/sender_me_clean.png');

const avatarSources: Record<string, ImageSourcePropType> = {
  '../assets/avater/deepaknaik-soniya-bansal-8065649.jpg': require('./assets/avater/deepaknaik-soniya-bansal-8065649.jpg'),
  '../assets/avater/ghostw1997-aodai-6004289.jpg': require('./assets/avater/ghostw1997-aodai-6004289.jpg'),
  '../assets/avater/hiteshhtsharma-srishti-textile-9876622.jpg': require('./assets/avater/hiteshhtsharma-srishti-textile-9876622.jpg'),
  '../assets/avater/rachealmarie-ai-generated-8626079_1920.jpg': require('./assets/avater/rachealmarie-ai-generated-8626079_1920.jpg'),
  '../assets/avater/raheel9630-aditi-rao-hydari-1748439_1920.jpg': require('./assets/avater/raheel9630-aditi-rao-hydari-1748439_1920.jpg'),
  '../assets/avater/raheel9630-priyanka-chopra-1748203_1920.jpg': require('./assets/avater/raheel9630-priyanka-chopra-1748203_1920.jpg'),
  '../assets/avater/jorna_avatar.png': require('./assets/avater/jorna_avatar.png'),
  '../assets/avater/sender_me_clean.png': senderAvatarSource,
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

/* SVG Helpers for precise conversation matching */
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

export default function App() {
  const [activeContactId, setActiveContactId] = useState<string | null>('c3');
  const [messageInput, setMessageInput] = useState('');

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
          {messages.map((item) => {
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
                  {/* Left Avatar for incoming */}
                  {!mine && (
                    <View style={styles.avatarColumn}>
                      {showAvatar ? (
                        <ContactAvatar contact={activeContact} size={36} />
                      ) : (
                        <View style={styles.avatarPlaceholder} />
                      )}
                    </View>
                  )}

                  {/* Call Bubble */}
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

                  {/* Right Avatar for outgoing */}
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
                        <ContactAvatar contact={activeContact} size={36} />
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
          })}
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
      <StatusBar barStyle="light-content" backgroundColor="#16171B" />
      <View style={styles.screen}>
        {activeContactId ? renderConversation() : renderContacts()}
      </View>
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

  /* Conversation Header */
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

  /* Conversation Messages List */
  chatScroll: {
    flex: 1,
    backgroundColor: '#0E0F12',
  },
  chatScrollContent: {
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 14,
  },

  /* Date Badges */
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

  /* Rows & Avatars */
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

  /* Bubble Tails */
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

  /* Call Cards */
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

  /* Text Bubbles */
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

  /* Reactions Bar */
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

  /* Composer Bar */
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

  /* Contacts & Main Screen Styles */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 6 : 10,
    paddingBottom: 12,
    backgroundColor: '#16171B',
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
    backgroundColor: '#16171B',
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
});
