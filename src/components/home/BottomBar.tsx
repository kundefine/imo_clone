import { Plus, Search } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/colors';

type BottomBarProps = {
  onAddPress: () => void;
  onSearchPress?: () => void;
};

export const BottomBar: React.FC<BottomBarProps> = ({
  onAddPress,
  onSearchPress,
}) => {
  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.bottomBarBtn}
        onPress={onAddPress}
      >
        <Plus color={Colors.imoBlue} size={28} strokeWidth={2.4} />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.bottomBarBtn}
        onPress={onSearchPress}
      >
        <Search color={Colors.imoBlue} size={25} strokeWidth={2.4} />
      </TouchableOpacity>
    </View>
  );
};

// Also export alias for compatibility
export const FloatingActions = BottomBar;

const styles = StyleSheet.create({
  bottomBar: {
    height: 52,
    backgroundColor: Colors.backgroundDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    borderTopWidth: 1,
    borderTopColor: '#1A1C22',
  },
  bottomBarBtn: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
