import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { reactionDiceSource, reactionEmojis } from '../../constants/assets';

type ReactionBarProps = {
  onSelectReaction?: (emoji: string) => void;
  onDicePress?: () => void;
};

export const ReactionBar: React.FC<ReactionBarProps> = ({
  onSelectReaction,
  onDicePress,
}) => {
  return (
    <View style={styles.reactionBar}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.reactionItem}
        onPress={onDicePress}
      >
        <Image source={reactionDiceSource} style={styles.reactionDice} resizeMode="contain" />
      </TouchableOpacity>
      {reactionEmojis.map((emoji, index) => (
        <TouchableOpacity
          key={index}
          activeOpacity={0.7}
          style={styles.reactionItem}
          onPress={() => onSelectReaction && onSelectReaction(emoji)}
        >
          <Text style={styles.reactionEmojiText}>{emoji}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  reactionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#16171B',
    borderTopWidth: 1,
    borderTopColor: '#1E2128',
  },
  reactionItem: {
    padding: 3,
  },
  reactionDice: {
    width: 25,
    height: 25,
  },
  reactionEmojiText: {
    fontSize: 22,
  },
});
