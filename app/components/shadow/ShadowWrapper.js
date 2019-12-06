import React from 'react';
import { StyleSheet, View } from 'react-native';
const styles = StyleSheet.create({
    wrapper: {
        borderColor: '#fff',
        borderWidth: 0,
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowColor: 'rgba(0,0,0,0.12)', 
        shadowOffset: { height: 12, width: 0 },
        elevation: 15,
    }
});

const ShadowWrapper = ({ children, style }) => (
    <View style={[styles.wrapper, style]}>
        {children}
    </View>
);

export default ShadowWrapper;
