import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ImageBoxView from '../image/imageBoxView';

import styles from './styles';

const MusicMediumHorizontalComponent = props => (
    <View style={[styles.container, props.index % 2 == 0 ? 
        { marginRight: 10 } : { marginLeft: 10}]}>
        <TouchableOpacity activeOpacity={0.8} 
            onPress={() => props.onPress()}>
            <ImageBoxView
                customStyle={styles.largePicture}
                isEmptyGrayBox
                isRadius
                boxSize="md"
                source={props.item.artwork ? { uri: props.item.artwork } : ""}
            />
            <Text style={styles.title} numberOfLines={1}>{props.item.title}</Text>
            <Text style={styles.name} numberOfLines={1}>{props.item.artist}</Text>
        </TouchableOpacity>
    </View>
);

export default MusicMediumHorizontalComponent;
