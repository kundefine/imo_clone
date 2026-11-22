import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';

type TextBubbleProps = {
  text: string;
  time: string;
  isMine: boolean;
  isPhone?: boolean;
};

export const TextBubble: React.FC<TextBubbleProps> = ({
  text,
  time,
  isMine,
  isPhone,
}) => {
  return (
    <View style={[styles.textBubble, isMine ? styles.textBubbleMine : styles.textBubbleTheirs]}>
      <Text style={[styles.messageText, isPhone && styles.messagePhoneText]}>
        {text}
      </Text>

      <View style={styles.textMetaRow}>
        <Text style={[styles.messageTime, isMine ? styles.callTimeMine : styles.callTimeTheirs]}>
          {time}
        </Text>
        {isMine && <View style={styles.messageSeenRing} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textBubble: {
    paddingHorizontal: 13,
    paddingTop: 8,
    paddingBottom: 7,
    borderRadius: 14,
    maxWidth: '82%',
  },
  textBubbleMine: {
    backgroundColor: Colors.bubbleMine,
  },
  textBubbleTheirs: {
    backgroundColor: Colors.bubbleTheirs,
  },
  messageText: {
    fontSize: 15.5,
    color: '#FFFFFF',
    lineHeight: 21,
  },
  messagePhoneText: {
    color: Colors.imoCyan,
    textDecorationLine: 'underline',
  },
  textMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  messageTime: {
    fontSize: 11,
    fontWeight: '400',
  },
  callTimeMine: {
    color: '#84BBDD',
  },
  callTimeTheirs: {
    color: '#8F949D',
  },
  messageSeenRing: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: Colors.imoCyan,
    marginLeft: 3,
  },
});
