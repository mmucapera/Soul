import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import styles from './styles/detault';

const DefaultButtonComponent = props => (
    <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={props.onPress}>
        <Text style={styles.buttonTitle}>{props.buttonTitle}</Text>
    </TouchableOpacity>
);

export default DefaultButtonComponent;
