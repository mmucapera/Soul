import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ImageBoxView from '../image/imageBoxView';
import styles from './styles/popular.style';

const PopularStationsComponent = props => (
    <View style={[styles.container]}>
        {props.items.map((item, index) =>
            <TouchableOpacity activeOpacity={0.8} onPress={() => props.onPress(item)} style={styles.containerRow} key={index}>
                <View>
                    <ImageBoxView
                        customStyle={styles.picture}
                        isEmptyGrayBox
                        isRadius
                        icon="music"
                        source={item.picture ? { uri: item.picture } : ""}
                    />
                </View>
                <View style={styles.actionTitle}>
                    <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                </View>
            </TouchableOpacity>
        )}
    </View>
);

export default PopularStationsComponent;
