import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Animated,
    Easing,
} from 'react-native';

import NetInfo from "@react-native-community/netinfo";
import strings from '../../localization/strings';
const alertHeight = 30;
const styles = StyleSheet.create({
    subView: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
});
class CheckConnection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstTime: true,
            connectionStatus: 'Connected',
            isConnected: null,
            // isConnected: false,
            isShow: false,
            // isShow: true,
            // offsetY: new Animated.Value(0),
            offsetY: new Animated.Value(alertHeight),
        };
    }

    UNSAFE_componentWillMount() {
        NetInfo.getConnectionInfo().then(connectionInfo => {
            this.CheckConnection(connectionInfo);
        });
        NetInfo.addEventListener(
            'connectionChange',
            this.CheckConnection,
        );
    }
    componentDidMount() {

    }
    CheckConnection = (connectionInfo) => {
        const that = this;

        if (connectionInfo.type === 'unknown' || connectionInfo.type === 'none') {
            this.setState({
                isConnected: false,
                isShow: true,
                connectionStatus: strings.no_connection,
            }, () => {
                Animated.timing(
                    this.state.offsetY,
                    {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true,
                        easing: Easing.inOut(Easing.ease),
                    },
                ).start(() => {
                    if (!that.state.firstTime) {
                        setTimeout(() => { that.setState({ isShow: false }); }, 2000);
                    } else {
                        setTimeout(() => { that.setState({ firstTime: false }); }, 2000);
                    }
                });
            });
        } else {
            this.setState({
                isConnected: true,
                isShow: !this.state.firstTime,
                connectionStatus: strings.back_online,
            }, () => {
                if (!that.state.firstTime) {
                    setTimeout(() => {
                        Animated.timing(
                            that.state.offsetY,
                            {
                                toValue: alertHeight,
                                duration: 500,
                                useNativeDriver: true,
                                easing: Easing.inOut(Easing.ease),
                            },
                        ).start(() => {
                            setTimeout(() => {
                                that.setState({ isShow: false });
                            }, 500);
                        });
                    }, 2000);
                } else {
                    setTimeout(() => { that.setState({ firstTime: false }); }, 2000);
                }
            });
        }
    }

    hideConnection = () => {
        const that = this;
        setTimeout(() => {
            Animated.timing(
                that.state.offsetY,
                {
                    toValue: alertHeight,
                    duration: 500,
                },
            ).start();
            setTimeout(() => {
                that.setState({ isShow: false });
            }, 700);
        }, 1000);
    }

    render() {
        if (!this.state.isConnected || this.state.isShow) {
            return (

                <Animated.View style={[styles.subView, { transform: [{ translateY: this.state.offsetY }] }]}>
                    <View style={[{ paddingVertical: 2 }, this.state.isConnected ? { backgroundColor: 'green' } : { backgroundColor: 'red' }]}>
                        <Text style={{ textAlign: 'center', color: '#ffff', fontSize: 14 }}>{this.state.connectionStatus}</Text>
                    </View>
                </Animated.View>
            );
        }
        return null;
    }
}


export default CheckConnection;
