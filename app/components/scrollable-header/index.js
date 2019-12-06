import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Animated } from 'react-native';
import PropTypes from 'prop-types';

export default class Collapsable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scrollY: new Animated.Value(0),
        }
    }
    render() {
        const {
            content,
            expandedHeaderTitle,
            expandedHeader,
            expandedHeight,
            collapsedHeight,
            containerStyle,
            scrollContainerStyle,
            headerContainerStyle,
            scrollIndicator
        } = this.props;

        const HEADER_EXPANDED_HEIGHT = expandedHeight;
        const HEADER_COLLAPSED_HEIGHT = 0;

        const headerHeight = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
            outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
            extrapolate: 'clamp',
        });

        const expandedHeaderOpacity = this.state.scrollY.interpolate({
            inputRange: [0, collapsedHeight - 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });

        return (
            <View style={[styles.container, containerStyle]}>
                <Animated.View style={[styles.header, headerContainerStyle, { height: headerHeight }]}>
                    <Animated.View style={{ height: headerHeight, opacity: expandedHeaderOpacity }}>
                        { expandedHeaderTitle()}
                    </Animated.View>
                </Animated.View>
                <ScrollView
                    contentContainerStyle={[styles.scrollContainer, scrollContainerStyle, { paddingTop: 20, zIndex: 1 }]}
                    onScroll={Animated.event([{
                        nativeEvent: {
                            contentOffset: {
                                y: this.state.scrollY,
                            }
                        }
                    }])}
                    showsVerticalScrollIndicator={scrollIndicator}
                    scrollEventThrottle={16}>
                    <Animated.View style={[{ opacity: expandedHeaderOpacity }]}>
                        {expandedHeader()}
                    </Animated.View>
                    {content()}
                </ScrollView>
            </View>
        );
    }
}

Collapsable.props = {
    containerStyle: PropTypes.style,
    scrollContainerStyle: PropTypes.style,
    headerContainerStyle: PropTypes.style,
    content: PropTypes.any.isRequired,
    expandedHeader: PropTypes.any.isRequired,
    expandedHeaderTitle: PropTypes.any.isRequired, 
    expandedHeight: PropTypes.number.isRequired,
    scrollIndicator: PropTypes.bool
}

Collapsable.defaultProps = {
    scrollIndicator: false,
    expandedHeaderTitle: null
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        padding: 0,
        paddingBottom: 35,
    },
    header: {
        backgroundColor: "#008675",
        width: '100%',
        position: 'absolute',
        top: -20,
        left: 0,
        zIndex: 0,
        opacity: 1
    },
});
