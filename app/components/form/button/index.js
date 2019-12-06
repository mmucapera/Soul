import React from 'react';
import { TouchableHighlight, Text, View } from 'react-native';
import IconComponent from 'react-native-vector-icons/MaterialCommunityIcons'
import styles from './style';
import { COLORS } from '../../../themes';

const PimaryButtonComponent = props => (
    <TouchableHighlight underlayColor={COLORS.text.primary} 
        style={[styles.button, props.index % 2 == 0 ? { marginRight: 5 } : { marginLeft: 5 }]}
        activeOpacity={0.8} 
        onPress={() => props.onPress(props.item)}
        onHideUnderlay={() => props.onHideUnderlay(props.item)}
        onShowUnderlay={() => props.onShowUnderlay(props.item)}>
        <View style={styles.container}>
        <Text style={[styles.name, props.item.active? { color: COLORS.text.white } : { color: COLORS.text.grey }]}>{props.item.name}</Text>
            <IconComponent name={props.item.icon} size={22} style={[styles.icon, props.item.active? { color: COLORS.text.white } : { color: COLORS.text.grey }]} />
        </View>
    </TouchableHighlight>
);

export default PimaryButtonComponent;
