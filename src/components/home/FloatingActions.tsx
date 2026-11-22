import { Plus, Search } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/colors';

type FloatingActionsProps = {
  onAddPress: () => void;
  onSearchPress?: () => void;
};

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  onAddPress,
  onSearchPress,
}) => {
  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.bottomActionBtn}
        onPress={onAddPress}
      >
        <Plus color={Colors.imoBlue} size={30} strokeWidth={2.4} />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.bottomActionBtn}
        onPress={onSearchPress}
      >
        <Search color={Colors.imoBlue} size={26} strokeWidth={2.4} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    bottom: 22,
    right: 18,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 14,
  },
  bottomActionBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1E2128',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#292D36',
  },
});
