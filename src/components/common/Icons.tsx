import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { Colors } from '../../constants/colors';

export function TopBarChatIcon() {
  return (
    <Svg width={27} height={27} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 11.5C20 16.19 16.19 20 11.5 20C10.05 20 8.68 19.64 7.48 18.99L3 20.2L4.25 15.82C3.47 14.54 3 13.07 3 11.5C3 6.81 6.81 3 11.5 3C16.19 3 20 6.81 20 11.5Z"
        fill={Colors.imoBlue}
      />
      <Path d="M7.5 10H15.5M7.5 13.5H12.5" stroke="#0E0F12" strokeWidth={1.9} strokeLinecap="round" />
    </Svg>
  );
}

export function MissedCallIcon({ size = 15, color = Colors.alertRed }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16 4L7 13M7 13H12M7 13V8"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M21 16.5v2.8a1.8 1.8 0 0 1-1.96 1.8 17.8 17.8 0 0 1-7.77-2.76 17.5 17.5 0 0 1-5.4-5.4A17.8 17.8 0 0 1 3.1 5.17 1.8 1.8 0 0 1 4.9 3.2h2.8a1.8 1.8 0 0 1 1.8 1.55 11.5 11.5 0 0 0 .63 2.53 1.8 1.8 0 0 1-.4 1.9L8.55 10.36a14.4 14.4 0 0 0 5.4 5.4l1.18-1.18a1.8 1.8 0 0 1 1.9-.4 11.5 11.5 0 0 0 2.53.63 1.8 1.8 0 0 1 1.44 1.69z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function AudioSubtitleIcon({ size = 14, color = Colors.textMuted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="8" y="2" width="8" height="12" rx="4" stroke={color} strokeWidth="1.9" />
      <Path d="M4 10C4 14.4 7.6 18 12 18C16.4 18 20 14.4 20 10" stroke={color} strokeWidth="1.9" strokeLinecap="round" />
      <Path d="M12 18V22M8 22H16" stroke={color} strokeWidth="1.9" strokeLinecap="round" />
    </Svg>
  );
}

export function VideoSubtitleIcon({ size = 15, color = Colors.textMuted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="5" width="13" height="14" rx="3" stroke={color} strokeWidth="1.9" />
      <Path d="M15 10L21 6V18L15 14" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function GreenCheckBadge() {
  return (
    <View style={iconStyles.verifiedBadge}>
      <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
        <Path d="M5 13L9 17L19 7" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </View>
  );
}

export function VideoCallIcon({ size = 20, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 6.5C3 5.12 4.12 4 5.5 4H14.5C15.88 4 17 5.12 17 6.5V17.5C17 18.88 15.88 20 14.5 20H5.5C4.12 20 3 18.88 3 17.5V6.5Z"
        fill={color}
      />
      <Path
        d="M17 10.2L20.5 7.7C21.1 7.27 22 7.7 22 8.44V15.56C22 16.3 21.1 16.73 20.5 16.3L17 13.8V10.2Z"
        fill={color}
      />
    </Svg>
  );
}

export function CanceledVideoIcon({ size = 20, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 6.5C3 5.12 4.12 4 5.5 4H14.5C15.88 4 17 5.12 17 6.5V17.5C17 18.88 15.88 20 14.5 20H5.5C4.12 20 3 18.88 3 17.5V6.5Z"
        fill={color}
      />
      <Path
        d="M17 10.2L20.5 7.7C21.1 7.27 22 7.7 22 8.44V15.56C22 16.3 21.1 16.73 20.5 16.3L17 13.8V10.2Z"
        fill={color}
      />
      <Path
        d="M7.5 14.5L12.5 9.5M12.5 9.5H8.8M12.5 9.5V13.2"
        stroke="#033B5E"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function BubbleTailMine({ color = Colors.bubbleTailMine }: { color?: string }) {
  return (
    <View style={iconStyles.tailMinePosition}>
      <Svg width={8} height={12} viewBox="0 0 8 12">
        <Path d="M0 0 Q6 1 8 0 C5 3 2 8 0 12 Z" fill={color} />
      </Svg>
    </View>
  );
}

export function BubbleTailTheirs({ color = Colors.bubbleTailTheirs }: { color?: string }) {
  return (
    <View style={iconStyles.tailTheirsPosition}>
      <Svg width={8} height={12} viewBox="0 0 8 12">
        <Path d="M8 0 Q2 1 0 0 C3 3 6 8 8 12 Z" fill={color} />
      </Svg>
    </View>
  );
}

export function OpenSmileIcon({ size = 24, color = '#9AA0A6' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="1.9" />
      <Circle cx="8.8" cy="9.8" r="1.2" fill={color} />
      <Circle cx="15.2" cy="9.8" r="1.2" fill={color} />
      <Path
        d="M7.8 13.5C8.3 16.2 10.8 17.5 12 17.5C13.2 17.5 15.7 16.2 16.2 13.5H7.8Z"
        stroke={color}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function GalleryIcon({ size = 22, color = '#B8BDC3' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3.5" y="3.5" width="17" height="17" rx="4.5" stroke={color} strokeWidth="1.9" />
      <Circle cx="8.5" cy="8.5" r="1.5" fill={color} />
      <Path
        d="M20.5 16.2L15.5 11.2L5 20.5"
        stroke={color}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CirclePlusIcon({ size = 22, color = '#B8BDC3' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="1.9" />
      <Path d="M12 7.5V16.5M7.5 12H16.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

export function MicIcon({ size = 22, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="8.5" y="3.5" width="7" height="11.5" rx="3.5" fill={color} />
      <Path
        d="M5 10.5C5 14.36 8.13 17.5 12 17.5C15.87 17.5 19 14.36 19 10.5"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <Path d="M12 17.5V21.5M8.5 21.5H15.5" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  );
}

const iconStyles = StyleSheet.create({
  tailMinePosition: {
    position: 'absolute',
    right: -7,
    top: 0,
    zIndex: 1,
  },
  tailTheirsPosition: {
    position: 'absolute',
    left: -7,
    top: 0,
    zIndex: 1,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: Colors.badgeGreen,
    borderWidth: 1.5,
    borderColor: '#16171B',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
