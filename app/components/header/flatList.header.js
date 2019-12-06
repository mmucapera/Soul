import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';

const FlatListHeader = props => (
    <View style={[styles.container, props.customStyle]}>
        <Text style={styles.title}>
            {props.title}
        </Text>
        {props.seeAll && 
            <TouchableOpacity  onPress={() => props.onPress(props.title)}>
                 <View style={styles.seeAll}>
                  <Text style={styles.button}>  {props.seeAll} </Text>
                </View>
            </TouchableOpacity>
        }
    </View>
);

export default FlatListHeader;
