import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import IconComponent from 'react-native-vector-icons/Entypo'
import IconFeather from 'react-native-vector-icons/Feather'

import ImageBoxView from '../../image/imageBoxView';
import styles from '../styles/style.trending';

import { SkypeIndicator } from 'react-native-indicators';

const TrendingMusicHorizontalComponent = props  => (
    <View style={[styles.container]}>
        {props.item.map((song, index) =>
            <TouchableOpacity activeOpacity={0.8} onPress={() => props.onPress(song)} style={styles.containerRow} key={index}>
            <View>  
                <ImageBoxView
                customStyle={styles.picture}
                isEmptyGrayBox
                isRadius
                icon="music"
                source={song.artwork ? { uri: song.artwork } : ""}
                />
            </View>
            <View style={styles.actionTitle}>
                <Text style={styles.title} numberOfLines={1}>{song.title}</Text>
                <Text style={styles.name} numberOfLines={1}>{song.artist}</Text>
            </View>
        {
            !song.purchase_status &&
            <View style={styles.actionIcon}>
                <IconFeather name="lock" size={18} style={styles.actionIcon.iconDotDot} />
            </View>
        }

            {/* <View style={styles.actionIcon}>
            {
                song.downloading &&
                <SkypeIndicator style = {{marginRight: 20}} size = {20} color = '#ffffff' />
            }
            {
                !song.downloading &&
                <TouchableOpacity activeOpacity={0.8} onPress = {() => props.onPressDownload(song)}> 
                    <IconComponent name="download" size={20} style={styles.actionIcon.iconDotDot} />
                </TouchableOpacity>
            }
            </View> */}

            </TouchableOpacity>
           
        )}
    </View>
);

// const TrendingMusicHorizontalComponent = props  => (
//     <View style={[styles.container]}>
//         <TouchableOpacity activeOpacity={0.8} onPress={() => props.onPress(props.item)}>
//                 <ImageBoxView
//                 customStyle={styles.picture}
//                 isEmptyGrayBox
//                 isRadius
//                 boxSize="md"
//                 source={props.item.artwork ? { uri: props.item.artwork } : ""}
//                 />
//             <Text style={styles.title} numberOfLines={1}>{props.item.title}</Text>
//             <Text style={styles.name} numberOfLines={1}>{props.item.artist}</Text>

//         </TouchableOpacity>
//     </View>
           
// );

export default TrendingMusicHorizontalComponent;
