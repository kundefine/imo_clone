import { FontAwesome5 } from '@expo/vector-icons';
import { Plus } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { StoryItem } from '../../types';

type StoriesRowProps = {
  stories: StoryItem[];
};

export const StoriesRow: React.FC<StoriesRowProps> = ({ stories }) => {
  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storyRow}
      >
        {stories.map((item) => (
          <View key={item.id} style={styles.storyItem}>
            {item.plus ? (
              <View style={styles.storyAddWrap}>
                <View style={styles.storyAddCircle}>
                  <FontAwesome5 name="camera" size={24} color="#C4CAD1" />
                </View>
                <View style={styles.storyPlusBadge}>
                  <Plus color="#FFFFFF" size={16} strokeWidth={3} />
                </View>
              </View>
            ) : (
              <View style={styles.storyImageWrap}>
                <Image source={item.image!} style={styles.storyImg} />
              </View>
            )}
            <Text style={styles.storyLabel} numberOfLines={1}>
              {item.name}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.listSeparator} />
    </>
  );
};

const styles = StyleSheet.create({
  storyRow: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: Colors.backgroundDark,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 18,
    width: 60,
  },
  storyAddWrap: {
    position: 'relative',
    width: 58,
    height: 58,
  },
  storyAddCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#272A31',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyPlusBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.imoBlue,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.backgroundDark,
  },
  storyImageWrap: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2.2,
    borderColor: Colors.imoBlue,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  storyLabel: {
    fontSize: 12.5,
    color: '#D4D8DD',
    marginTop: 6,
    textAlign: 'center',
    fontWeight: '400',
  },
  listSeparator: {
    height: 1,
    backgroundColor: '#1C1E23',
    marginHorizontal: 16,
    marginBottom: 4,
  },
});
