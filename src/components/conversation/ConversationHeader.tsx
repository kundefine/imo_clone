import { FontAwesome5 } from '@expo/vector-icons';
import { ArrowLeft, MoreVertical } from 'lucide-react-native';
import React from 'react';
import { Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { ContactItem } from '../../types';

type ConversationHeaderProps = {
  contact: ContactItem;
  lastSeen?: string;
  onBack: () => void;
  onVoiceCall?: () => void;
  onVideoCall?: () => void;
  onMoreOptions?: () => void;
};

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  contact,
  lastSeen = 'Last seen recently',
  onBack,
  onVoiceCall,
  onVideoCall,
  onMoreOptions,
}) => {
  return (
    <View style={styles.chatHeader}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.chatHeaderBack}
        onPress={onBack}
      >
        <ArrowLeft color="#FFFFFF" size={24} strokeWidth={2.4} />
      </TouchableOpacity>

      <View style={styles.chatHeaderCenter}>
        <Text style={styles.chatHeaderTitle} numberOfLines={1}>
          {contact.name}
        </Text>
        <Text style={styles.chatHeaderSubtitle} numberOfLines={1}>
          {lastSeen}
        </Text>
      </View>

      <View style={styles.chatHeaderActions}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.headerActionBtn}
          onPress={onVoiceCall}
        >
          <FontAwesome5 name="phone-alt" size={19} color={Colors.imoBlue} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.headerActionBtn}
          onPress={onVideoCall}
        >
          <FontAwesome5 name="video" size={19} color={Colors.imoBlue} solid />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.headerActionBtn}
          onPress={onMoreOptions}
        >
          <MoreVertical color="#FFFFFF" size={24} strokeWidth={2.4} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0;

const styles = StyleSheet.create({
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: statusBarHeight > 0 ? statusBarHeight + 6 : 12,
    paddingBottom: 10,
    backgroundColor: Colors.headerDark,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2128',
  },
  chatHeaderBack: {
    padding: 6,
    marginRight: 4,
  },
  chatHeaderCenter: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  chatHeaderSubtitle: {
    color: '#8E949E',
    fontSize: 12.5,
    marginTop: 2,
    fontWeight: '400',
  },
  chatHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerActionBtn: {
    padding: 8,
  },
});
