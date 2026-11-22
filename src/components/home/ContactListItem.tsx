import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { ContactItem } from '../../types';
import { Avatar } from '../common/Avatar';
import { AudioSubtitleIcon, MissedCallIcon, VideoSubtitleIcon } from '../common/Icons';

type ContactListItemProps = {
  contact: ContactItem;
  onPress: () => void;
  onCallPress?: () => void;
};

export const ContactListItem: React.FC<ContactListItemProps> = ({
  contact,
  onPress,
  onCallPress,
}) => {
  const renderSubtitle = () => {
    switch (contact.subtitleType) {
      case 'missed_call':
        return (
          <View style={styles.subtitleRow}>
            <MissedCallIcon />
            <Text style={styles.subtitleMissedText}>{contact.subtitle}</Text>
          </View>
        );
      case 'emoji':
        return (
          <View style={styles.subtitleRow}>
            <Text style={styles.subtitleHeartText}>{contact.subtitle}</Text>
          </View>
        );
      case 'audio':
        return (
          <View style={styles.subtitleRow}>
            <AudioSubtitleIcon />
            <Text style={styles.subtitleMutedText}>{contact.subtitle}</Text>
          </View>
        );
      case 'video_canceled':
        return (
          <View style={styles.subtitleRow}>
            <VideoSubtitleIcon />
            <Text style={styles.subtitleMutedText}>{contact.subtitle}</Text>
          </View>
        );
      default:
        return (
          <View style={styles.subtitleRow}>
            <Text style={styles.subtitleMutedText}>{contact.subtitle}</Text>
          </View>
        );
    }
  };

  return (
    <TouchableOpacity
      style={styles.contactRow}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Avatar contact={contact} size={58} />

      <View style={styles.contactBody}>
        <Text style={styles.contactName} numberOfLines={1}>
          {contact.name}
        </Text>
        {renderSubtitle()}
      </View>

      <View style={styles.contactMeta}>
        <Text style={styles.contactDate}>{contact.date}</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.callIconBtn}
          onPress={onCallPress || onPress}
        >
          <FontAwesome5 name="phone-alt" size={17} color={Colors.imoBlue} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 11,
    backgroundColor: Colors.backgroundDark,
  },
  contactBody: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  contactName: {
    fontSize: 16.5,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  subtitleMissedText: {
    fontSize: 13,
    color: Colors.alertRed,
    fontWeight: '400',
  },
  subtitleHeartText: {
    fontSize: 14,
  },
  subtitleMutedText: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '400',
  },
  contactMeta: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 10,
  },
  contactDate: {
    fontSize: 12.5,
    color: '#7E848D',
    marginBottom: 8,
    fontWeight: '400',
  },
  callIconBtn: {
    padding: 4,
  },
});
