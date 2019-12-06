import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ImageBoxView from '../image/imageBoxView';
import styles from './styles/recently.style';

const RecentlyPlayedStationsComponent = props => (
    <View style={[styles.container, props.index % 2 == 0 ?
        { marginRight: 10 } : { marginLeft: 10 }]}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => props.onPress(props.item)}>
            <ImageBoxView
                customStyle={styles.largePicture}
                isEmptyGrayBox
                isRadius
                boxSize="md"
                source={props.item.picture ? { uri: props.item.picture } : ""}
            />
            <Text style={styles.name} numberOfLines={1}>{props.item.name}</Text>
        </TouchableOpacity>
    </View>
);

export default RecentlyPlayedStationsComponent;
