import React from 'react';
import { View } from 'react-native';
import styles from './style';
import { BallIndicator } from 'react-native-indicators';
import { COLORS } from '../../../themes';

const FooterLoading = ({ customTextColor, customSize, isLoadMore }) => (
    <View>
        {isLoadMore ? (
            <View style={styles.loadMore}>
                <BallIndicator size={customSize ? customSize.size : 25} color={customTextColor ? customTextColor : COLORS.text.primary} />
            </View> 
        ) : (
                null
            )}
    </View>

);
export default FooterLoading;
