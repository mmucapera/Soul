import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles/header.style';
import ImageBoxView from '../../components/image/imageBoxView';
import { IconCustomV2 } from '../../lib/IconCustom';

import global from '../../global/global';

const HeaderComponent = props => (
    <TouchableOpacity activeOpacity={0.8} style={[styles.container]}>
        <View style={styles.wrapper}>
            <ImageBoxView
                customStyle={styles.picture}
                isEmptyGrayBox
                isRadius
                source={props.avatar_url == "" ? require('../../images/avatar.png') : { uri: props.avatar_url }}
            />
            <View style = {{marginLeft: 10}}>
                <Text style={styles.name} numberOfLines={1}>{props.display_name}</Text>
                <Text style={styles.subLabel} numberOfLines={1}>{props.email}</Text>
            </View>
        </View>
        {/* <View>
            <IconCustomV2 style={[styles.icon]} name="arrow-right" />
        </View> */}
    </TouchableOpacity>
);
export default HeaderComponent;
