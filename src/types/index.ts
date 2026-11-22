import { ImageSourcePropType } from 'react-native';

export type SubtitleType = 'missed_call' | 'emoji' | 'audio' | 'video_canceled' | 'normal';

export type ContactItem = {
  id: string;
  name: string;
  subtitle: string;
  subtitleType?: SubtitleType;
  date: string;
  avater?: string;
  imageUri?: string;
  isDefaultAvatar?: boolean;
  verifiedBadge?: boolean;
  icon: 'phone' | 'chevron';
};

export type DeviceContactItem = {
  id: string;
  name: string;
  phone?: string;
  imageUri?: string;
};

export type StoryItem = {
  id: string;
  name: string;
  image?: ImageSourcePropType;
  plus?: boolean;
};

export type CallTone = 'missed' | 'done' | 'video' | 'canceled';

export type ConversationItem =
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
      callTone: CallTone;
      showAvatar?: boolean;
    };

export type ConversationThread = {
  contactId: string;
  lastSeen: string;
  messages: ConversationItem[];
};
