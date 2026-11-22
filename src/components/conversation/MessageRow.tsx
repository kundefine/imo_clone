import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { senderAvatarSource } from '../../constants/assets';
import { Colors } from '../../constants/colors';
import { ContactItem, ConversationItem } from '../../types';
import { Avatar } from '../common/Avatar';
import { BubbleTailMine, BubbleTailTheirs } from '../common/Icons';
import { CallCard } from './CallCard';
import { TextBubble } from './TextBubble';

type MessageRowProps = {
  item: ConversationItem;
  contact: ContactItem;
};

export const MessageRow: React.FC<MessageRowProps> = ({ item, contact }) => {
  if (item.type === 'date') {
    return (
      <View style={styles.dateBadgeWrap}>
        <View style={styles.dateBadge}>
          <Text style={styles.dateBadgeText}>{item.label}</Text>
        </View>
      </View>
    );
  }

  const mine = item.sender === 'me';
  const showAvatar = item.showAvatar !== false;

  return (
    <View
      style={[
        styles.messageRow,
        mine ? styles.messageRowMine : styles.messageRowTheirs,
      ]}
    >
      {/* Their Avatar */}
      {!mine && (
        <View style={styles.avatarColumn}>
          {showAvatar ? (
            <Avatar contact={contact} size={36} showBadge={false} />
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}
        </View>
      )}

      {/* Bubble with Tail */}
      <View style={styles.bubbleWrapper}>
        {showAvatar && (
          mine ? <BubbleTailMine color={Colors.bubbleTailMine} /> : <BubbleTailTheirs color={Colors.bubbleTailTheirs} />
        )}

        <View style={!showAvatar ? (mine ? styles.bubbleNoTailMine : styles.bubbleNoTailTheirs) : undefined}>
          {item.type === 'call' && (
            <CallCard
              title={item.title}
              subtitle={item.subtitle}
              time={item.time}
              callTone={item.callTone}
              isMine={mine}
            />
          )}

          {item.type === 'text' && (
            <TextBubble
              text={item.text}
              time={item.time}
              isMine={mine}
              isPhone={item.isPhone}
            />
          )}
        </View>
      </View>

      {/* My Avatar */}
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
};

const styles = StyleSheet.create({
  dateBadgeWrap: {
    alignItems: 'center',
    marginVertical: 14,
  },
  dateBadge: {
    backgroundColor: '#1E2128',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 12,
  },
  dateBadgeText: {
    color: '#8A9099',
    fontSize: 12,
    fontWeight: '500',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
    paddingHorizontal: 10,
  },
  messageRowMine: {
    justifyContent: 'flex-end',
  },
  messageRowTheirs: {
    justifyContent: 'flex-start',
  },
  avatarColumn: {
    width: 36,
    alignItems: 'center',
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
    maxWidth: '75%',
  },
  bubbleNoTailMine: {
    borderTopRightRadius: 14,
  },
  bubbleNoTailTheirs: {
    borderTopLeftRadius: 14,
  },
});
