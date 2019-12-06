import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import IconComponent from 'react-native-vector-icons/Entypo'
import IconFeather from 'react-native-vector-icons/Feather'
import ImageBoxView from '../../image/imageBoxView';
import styles from '../styles/style.vertical';
import { SkypeIndicator } from 'react-native-indicators';

const MusicVerticalComponent = props => (
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
    {
        !props.item.purchase_status &&
        <View style={styles.actionIcon}>
            <IconFeather name="lock" size={18} style={styles.actionIcon.iconDotDot} />
        </View>
    }
    {
        props.parent == "user-playlist" &&
        <TouchableOpacity activeOpacity={0.8} style={styles.actionIcon} onPress = {() => props.onDeletePress(props.item)}>
            <IconFeather name="trash-2" size={18} style={styles.actionIcon.iconDotDot} />
        </TouchableOpacity>
    }
        {/* <View style={styles.actionIcon}>
            <TouchableOpacity activeOpacity={0.8} onPress = {() => props.onPressDownload(props.item)}>
                {
                    props.item.downloading &&
                    <SkypeIndicator style = {{marginRight: 20}} size = {20} color = '#ffffff' />
                }
                {
                    !props.item.downloading &&
                    <IconComponent name="download" size={18} style={styles.actionIcon.iconDotDot} />
                }
            </TouchableOpacity>
        </View> */}
    </TouchableOpacity>
);

export default MusicVerticalComponent;
