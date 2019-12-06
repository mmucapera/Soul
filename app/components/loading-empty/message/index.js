import React from 'react';
import { View, FlatList } from 'react-native';
import styles from './style';
import ImageBoxView from '../../image/imageBoxView';
const dataloading = [
    '1', '2', '3', '4'
];
const MessageEmpty = () => (
    <FlatList
        removeClippedSubviews
        keyExtractor={(index) => index.toString()}
        listKey={(index) => index.toString()}
        data={dataloading}
        scrollEnabled={false}
        renderItem={() => (
            <View style={styles.explore.rowWrapper}>
                <View style={styles.explore.rowWrapper.container}>
                    <ImageBoxView customStyle={styles.explore.rowWrapper.container.vertical_image} isEmptyGrayBox />
                    <View style={styles.explore.rowWrapper.container.columWrapper}>
                        <View style={styles.explore.rowWrapper.container.column} />
                        <View style={[styles.explore.rowWrapper.container.column, { width: '70%' }]} />
                    </View>
                </View>
            </View>
        )}
    />
)
export default MessageEmpty;
