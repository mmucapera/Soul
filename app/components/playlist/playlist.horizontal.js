import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ImageBoxView from '../image/imageBoxView';
import styles from './style';

const PlaylistHorizontalComponent = ({ onPress, item }) => (
    <View style={[styles.container]}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => onPress(item)}>
            <ImageBoxView
                customStyle={styles.picture}
                isEmptyGrayBox
                isRadius
                boxSize="md"
                source={item.picture ? { uri: item.picture } : ""}
            />
            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        </TouchableOpacity>
    </View>
);

export default PlaylistHorizontalComponent;
