import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { Image, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { senderAvatarSource } from '../../constants/assets';
import { Colors } from '../../constants/colors';
import { TopBarChatIcon } from '../common/Icons';

type TopBarProps = {
  onOpenAddModal: () => void;
};

export const TopBar: React.FC<TopBarProps> = ({ onOpenAddModal }) => {
  return (
    <View style={styles.topBar}>
      {/* Current User Profile */}
      <TouchableOpacity activeOpacity={0.8}>
        <Image source={senderAvatarSource} style={styles.userAvatar} />
      </TouchableOpacity>

      {/* Center Tab (Chats Tab) */}
      <View style={styles.centerTab}>
        <TopBarChatIcon />
        <View style={styles.tabIndicator} />
      </View>

      {/* Right Action Button with Green "1" Badge */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.rightBtn}
        onPress={onOpenAddModal}
      >
        <View style={styles.rightUserWrap}>
          <FontAwesome5 name="user-alt" size={20} color="#B0B6BD" />
          <View style={styles.rightLines}>
            <View style={styles.rightLine} />
            <View style={styles.rightLine} />
          </View>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>1</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 6 : 10,
    paddingBottom: 4,
    backgroundColor: Colors.headerDark,
  },
  userAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  centerTab: {
    alignItems: 'center',
    flex: 1,
    paddingTop: 4,
  },
  tabIndicator: {
    width: 140,
    height: 3,
    backgroundColor: Colors.imoBlue,
    marginTop: 8,
    borderRadius: 1.5,
  },
  rightBtn: {
    position: 'relative',
    padding: 6,
  },
  rightUserWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightLines: {
    marginLeft: 3,
    justifyContent: 'center',
  },
  rightLine: {
    width: 7,
    height: 2,
    backgroundColor: '#B0B6BD',
    marginVertical: 1.5,
    borderRadius: 1,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.badgeGreen,
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.headerDark,
  },
  badgeText: {
    color: '#0E0F12',
    fontSize: 9.5,
    fontWeight: '800',
  },
});
