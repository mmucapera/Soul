import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PimaryButtonComponent } from '../../components/form';
import styles from './styles';

const FlatListHeaderButton = ({ onPress, onHideUnderlay, onShowUnderlay, items }) => (
    <View>
        <View style={styles.ListHeaderComponent}>
            {items.map((item, index) =>
                <PimaryButtonComponent
                    key={index}
                    index={index}
                    item={item}
                    onPress={onPress}
                    onHideUnderlay={onHideUnderlay}
                    onShowUnderlay={onShowUnderlay}
                />
            )}
        </View>
        <View style={styles.separateLine}></View>
    </View>
);

export default FlatListHeaderButton;
