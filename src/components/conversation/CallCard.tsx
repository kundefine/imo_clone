import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { CallTone } from '../../types';
import { CanceledVideoIcon, VideoCallIcon } from '../common/Icons';

type CallCardProps = {
  title: string;
  subtitle: string;
  time: string;
  callTone: CallTone;
  isMine: boolean;
};

export const CallCard: React.FC<CallCardProps> = ({
  title,
  subtitle,
  time,
  callTone,
  isMine,
}) => {
  return (
    <View style={[styles.callCard, isMine ? styles.callCardMine : styles.callCardTheirs]}>
      <View style={styles.callCardContent}>
        <View
          style={[
            styles.callIconCircle,
            callTone === 'missed' ? styles.callIconCircleMissed : styles.callIconCircleDark,
          ]}
        >
          {callTone === 'missed' ? (
            <FontAwesome5 name="video" size={17} color="#FFFFFF" solid />
          ) : callTone === 'canceled' ? (
            <CanceledVideoIcon size={20} color="#FFFFFF" />
          ) : (
            <VideoCallIcon size={20} color="#FFFFFF" />
          )}
        </View>

        <View style={styles.callBody}>
          <Text style={styles.callTitle}>{title}</Text>
          <Text style={[styles.callSubtitle, isMine ? styles.callSubtitleMine : styles.callSubtitleTheirs]}>
            {subtitle}
          </Text>
        </View>
      </View>

      <View style={styles.callFooter}>
        <Text style={[styles.callTime, isMine ? styles.callTimeMine : styles.callTimeTheirs]}>
          {time}
        </Text>
        {isMine && <View style={styles.messageSeenRing} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  callCard: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 7,
    borderRadius: 14,
    minWidth: 210,
    maxWidth: 275,
  },
  callCardMine: {
    backgroundColor: Colors.bubbleMine,
  },
  callCardTheirs: {
    backgroundColor: Colors.bubbleTheirs,
  },
  callCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  callIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callIconCircleDark: {
    backgroundColor: Colors.callCircleDark,
  },
  callIconCircleMissed: {
    backgroundColor: Colors.callCircleMissed,
  },
  callBody: {
    flex: 1,
  },
  callTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.1,
  },
  callSubtitle: {
    fontSize: 12.5,
    marginTop: 2,
  },
  callSubtitleMine: {
    color: '#84BBDD',
  },
  callSubtitleTheirs: {
    color: '#9CA2AB',
  },
  callFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 6,
    gap: 4,
  },
  callTime: {
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
