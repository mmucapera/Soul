import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ImageBoxView from '../image/imageBoxView';
import styles from './style.vertical';

const PlaylistVerticalComponent = props => (
    <View style={[styles.container, props.index % 2 == 0 ?
        { marginLeft: 15, marginRight: 15, } : { marginRight: 15, marginLeft: 15 }]}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => props.onPress(props.item)} onLongPress = {() => props.onLongPress(props.item)} delayLongPress = {1000}>
            <ImageBoxView
                customStyle={styles.largePicture}
                isEmptyGrayBox
                isRadius
                boxSize="md"
                source={props.item.picture ? { uri: props.item.picture } : ""}
            />
            <Text style={styles.title} numberOfLines={1}>{props.item.title}</Text>
            <Text style={styles.name} numberOfLines={1}>{props.item.name}</Text>
        </TouchableOpacity>
    </View>
);

export default PlaylistVerticalComponent;
