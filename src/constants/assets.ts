import { ImageSourcePropType } from 'react-native';
import { StoryItem } from '../types';

export const reactionEmojis = ['😡', '😭', '😩', '🥲', '👻', '😞', '😘', '💕'];

export const reactionDiceSource: ImageSourcePropType = require('../../assets/apk/reaction_first_icon.png');
export const senderAvatarSource: ImageSourcePropType = require('../../assets/avater/sender_me_clean.png');

export const avatarSources: Record<string, ImageSourcePropType> = {
  '../assets/avater/contact_musu_khala.png': require('../../assets/avater/contact_musu_khala.png'),
  '../assets/avater/contact_ronzu.png': require('../../assets/avater/contact_ronzu.png'),
  '../assets/avater/jorna_avatar.png': require('../../assets/avater/jorna_avatar.png'),
  '../assets/avater/contact_makon.png': require('../../assets/avater/contact_makon.png'),
  '../assets/avater/contact_kamrul.png': require('../../assets/avater/contact_kamrul.png'),
  '../assets/avater/contact_sumaiya.png': require('../../assets/avater/contact_sumaiya.png'),
  '../assets/avater/sender_me_clean.png': senderAvatarSource,
  '../assets/avater/story_porosh.png': require('../../assets/avater/story_porosh.png'),
  '../assets/avater/story_planet.png': require('../../assets/avater/story_planet.png'),
};

export const defaultStories: StoryItem[] = [
  { id: 's1', name: 'Story', plus: true },
  { id: 's2', name: 'পরশ', image: require('../../assets/avater/story_porosh.png') },
  { id: 's3', name: 'Planet', image: require('../../assets/avater/story_planet.png') },
];
