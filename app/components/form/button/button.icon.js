import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles from './styles/button.style';
import IconComponent from 'react-native-vector-icons/MaterialCommunityIcons'

const PimaryButtonIcon = props => (
    <TouchableOpacity activeOpacity={0.8} {...props} style={[styles.button, props.customStyle]}>
        {props.title ? <Text style={[styles.buttonTitle, props.customStyleTitle]}>{ props.title}</Text> : null }
        <IconComponent style={[styles.buttonIcon, props.customStyleIcon]} name={props.iconName} size={30}/>
    </TouchableOpacity>
);

export default PimaryButtonIcon;
