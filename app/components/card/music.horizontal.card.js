import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ImageBoxView from '../image/imageBoxView';
import styles from './styles';
import stylesHorizontal from './styles/style.horizontal';

const MusicHorizontalComponent = props => (
    <View style={[stylesHorizontal.container]}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => props.onPress()}>
            <ImageBoxView
                customStyle={styles.picture}
                isEmptyGrayBox
                isRadius
                boxSize="md"
                source={props.item.artwork ? { uri: props.item.artwork }: "" }
            />
            <Text style={styles.title} numberOfLines={1}>{props.item.title}</Text>
            <Text style={styles.name} numberOfLines={1}>{props.item.artist}</Text>
        </TouchableOpacity>
    </View>
    );

export default MusicHorizontalComponent;
