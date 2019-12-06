import React from 'react';
import { View, Text } from 'react-native';
import styles from './style';
const HeaderTitle = ({
    title,
}) => (<View style={styles.container}><Text style={styles.userName}>{title}</Text></View>);
export default HeaderTitle;
