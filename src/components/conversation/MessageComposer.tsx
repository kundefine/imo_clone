import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { CirclePlusIcon, GalleryIcon, MicIcon, OpenSmileIcon } from '../common/Icons';

type MessageComposerProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSend: (text: string) => void;
  onOpenGallery?: () => void;
  onOpenMoreActions?: () => void;
  onOpenEmojiPicker?: () => void;
};

export const MessageComposer: React.FC<MessageComposerProps> = ({
  value,
  onChangeText,
  onSend,
  onOpenGallery,
  onOpenMoreActions,
  onOpenEmojiPicker,
}) => {
  const handlePressAction = () => {
    if (value.trim()) {
      onSend(value.trim());
    }
  };

  const hasText = value.trim().length > 0;

  return (
    <View style={styles.composerBar}>
      <View style={styles.composerInputWrap}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.composerSmileBtn}
          onPress={onOpenEmojiPicker}
        >
          <OpenSmileIcon size={25} color="#9AA0A6" />
        </TouchableOpacity>

        <TextInput
          style={styles.composerTextInput}
          placeholder="Message"
          placeholderTextColor="#8F949B"
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={handlePressAction}
          returnKeyType="send"
        />

        <View style={styles.composerRightActions}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.composerActionIconBtn}
            onPress={onOpenGallery}
          >
            <GalleryIcon size={23} color="#B8BDC3" />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.composerActionIconBtn}
            onPress={onOpenMoreActions}
          >
            <CirclePlusIcon size={23} color="#B8BDC3" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.micCircleBtn}
        onPress={handlePressAction}
      >
        {hasText ? (
          <FontAwesome5 name="paper-plane" size={17} color="#FFFFFF" solid />
        ) : (
          <MicIcon size={23} color="#FFFFFF" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  composerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.headerDark,
    gap: 8,
  },
  composerInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.composerInputBg,
    borderRadius: 24,
    paddingHorizontal: 12,
    height: 46,
  },
  composerSmileBtn: {
    marginRight: 8,
  },
  composerTextInput: {
    flex: 1,
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.micBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
