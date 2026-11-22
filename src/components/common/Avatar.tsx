import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { avatarSources } from '../../constants/assets';
import { Colors } from '../../constants/colors';
import { ContactItem } from '../../types';
import { GreenCheckBadge } from './Icons';

type AvatarProps = {
  contact?: ContactItem | null;
  size?: number;
  showBadge?: boolean;
};

export const Avatar: React.FC<AvatarProps> = ({ contact, size = 58, showBadge = true }) => {
  if (!contact) {
    return (
      <View style={[styles.wrap, { width: size, height: size }]}>
        <View
          style={[
            styles.defaultSilhouette,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          <FontAwesome5 name="user" solid size={Math.round(size * 0.48)} color={Colors.defaultAvatarIcon} />
        </View>
      </View>
    );
  }

  // 1. Explicit phone image URI
  if (contact.imageUri) {
    return (
      <View style={[styles.wrap, { width: size, height: size }]}>
        <Image
          source={{ uri: contact.imageUri }}
          style={[styles.photo, { width: size, height: size, borderRadius: size / 2 }]}
        />
        {showBadge && contact.verifiedBadge && <GreenCheckBadge />}
      </View>
    );
  }

  // 2. Default avatar flag or missing asset
  if (contact.isDefaultAvatar || !contact.avater) {
    return (
      <View style={[styles.wrap, { width: size, height: size }]}>
        <View
          style={[
            styles.defaultSilhouette,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          <FontAwesome5 name="user" solid size={Math.round(size * 0.48)} color={Colors.defaultAvatarIcon} />
        </View>
        {showBadge && contact.verifiedBadge && <GreenCheckBadge />}
      </View>
    );
  }

  // 3. Bundled avatar asset
  const source = contact.avater ? avatarSources[contact.avater] : undefined;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      {source ? (
        <Image
          source={source}
          style={[styles.photo, { width: size, height: size, borderRadius: size / 2 }]}
        />
      ) : (
        <View
          style={[
            styles.defaultSilhouette,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          <FontAwesome5 name="user" solid size={Math.round(size * 0.48)} color={Colors.defaultAvatarIcon} />
        </View>
      )}
      {showBadge && contact.verifiedBadge && <GreenCheckBadge />}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  photo: {
    backgroundColor: '#282C34',
  },
  defaultSilhouette: {
    backgroundColor: Colors.defaultAvatarBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
