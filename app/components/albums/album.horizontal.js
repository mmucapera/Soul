import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ImageBoxView from '../image/imageBoxView';
import styles from './style';

const AlbumHorizontalComponent = props => (
    <View style={[styles.container]}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => props.onPress(props.item)}>
            <ImageBoxView
                customStyle={styles.picture}
                isEmptyGrayBox
                isRadius
                boxSize="md"
                source={props.item.picture ? { uri: props.item.picture } : ""}
            />
            <Text style={styles.name} numberOfLines={1}>{props.item.name}</Text>
        </TouchableOpacity>
    </View>
);

export default AlbumHorizontalComponent;
