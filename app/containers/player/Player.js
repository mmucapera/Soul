import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import IconComponent from 'react-native-vector-icons/Entypo'
import ImageBoxView from '../../components/image/imageBoxView';
import styles from './player.style';
import { SkypeIndicator } from 'react-native-indicators';

const PlayerComponent = props => (
    <TouchableOpacity activeOpacity={0.8}
        onPress={() => props.onPress(props.item)}
        style={[styles.container]}>
        <ImageBoxView
            customStyle={styles.picture}
            isRadius
            icon="music"
            source={props.item.artwork ? { uri: props.item.artwork } : ""}
        />
        <View style={styles.actionTitle}>
            <Text style={styles.title} numberOfLines={1}>{props.item.title}</Text>
            <Text style={styles.name} numberOfLines={1}>{props.item.artist}</Text>
        </View>
        {/* <View style={styles.actionIcon}>
        {
            props.item.downloading &&
            <SkypeIndicator style = {{marginRight: 20}} size = {20} color = '#ffffff' />
        }
        {
            !props.item.downloading &&
            <TouchableOpacity activeOpacity={0.8} onPress = {() => props.onPressDownload(props.item)}>
                <IconComponent name="download" size={20} style={styles.actionIcon.iconDotDot} />
            </TouchableOpacity>
        }
        </View> */}
    </TouchableOpacity>
);

export default PlayerComponent;
