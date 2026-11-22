import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Avatar } from '../components/common/Avatar';
import { ConversationHeader } from '../components/conversation/ConversationHeader';
import { MessageComposer } from '../components/conversation/MessageComposer';
import { MessageRow } from '../components/conversation/MessageRow';
import { ReactionBar } from '../components/conversation/ReactionBar';
import { Colors } from '../constants/colors';
import { ContactItem, ConversationItem, ConversationThread } from '../types';

type ConversationScreenProps = {
  contact: ContactItem;
  conversation: ConversationThread | null;
  onBack: () => void;
  onSendMessage: (text: string) => void;
  onSendReaction?: (emoji: string) => void;
  onVoiceCall?: () => void;
  onVideoCall?: () => void;
};

export const ConversationScreen: React.FC<ConversationScreenProps> = ({
  contact,
  conversation,
  onBack,
  onSendMessage,
  onSendReaction,
  onVoiceCall,
  onVideoCall,
}) => {
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const messages: ConversationItem[] = conversation?.messages ?? [];
  const lastSeen = conversation?.lastSeen ?? 'Last seen recently';

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    onSendMessage(text);
    setInputText('');
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleReaction = (emoji: string) => {
    if (onSendReaction) {
      onSendReaction(emoji);
    } else {
      handleSend(emoji);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 44 : 0}
    >
      {/* 1:1 Matching Imo Header */}
      <ConversationHeader
        contact={contact}
        lastSeen={lastSeen}
        onBack={onBack}
        onVoiceCall={onVoiceCall}
        onVideoCall={onVideoCall}
      />

      {/* Messages Scroll Area */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatScroll}
        contentContainerStyle={styles.chatScrollContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyChatWrap}>
            <Avatar contact={contact} size={72} />
            <Text style={styles.emptyChatName}>{contact.name}</Text>
            <Text style={styles.emptyChatSubtitle}>{contact.subtitle}</Text>
            <View style={styles.emptyChatWave}>
              <Text style={styles.emptyChatWaveText}>Say hello to start chatting 👋</Text>
            </View>
          </View>
        ) : (
          messages.map((item) => (
            <MessageRow key={item.id} item={item} contact={contact} />
          ))
        )}
      </ScrollView>

      {/* Quick Emoji Reaction Bar */}
      <ReactionBar onSelectReaction={handleReaction} />

      {/* Message Composer */}
      <MessageComposer
        value={inputText}
        onChangeText={setInputText}
        onSend={handleSend}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  chatScroll: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  chatScrollContent: {
    paddingVertical: 12,
    paddingBottom: 16,
  },
  emptyChatWrap: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  emptyChatName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 14,
  },
  emptyChatSubtitle: {
    color: Colors.textMuted,
    fontSize: 14,
    marginTop: 4,
  },
  emptyChatWave: {
    backgroundColor: '#1E2128',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#292D36',
  },
  emptyChatWaveText: {
    color: Colors.imoCyan,
    fontSize: 14,
    fontWeight: '500',
  },
});
