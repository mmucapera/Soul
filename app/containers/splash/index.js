
import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, } from 'react-native';
import {createStackNavigator} from "react-navigation"
import {YellowBox, 
    KeyboardAvoidingView,
    Dimensions,
    Keyboard,
    TouchableWithoutFeedback,
    Platform,
    ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { SkypeIndicator } from 'react-native-indicators';

import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';

import TrackPlayer from 'react-native-track-player';
import global from '../../global/global';
import { BaseManager } from '../../database'


var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var top_inset = Platform.OS == "ios" ? StaticSafeAreaInsets.safeAreaInsetsTop : 0;
var bottom_inset = Platform.OS == "ios" ? StaticSafeAreaInsets.safeAreaInsetsBottom : 30;
var safearea_height = deviceHeight - top_inset - bottom_inset;
YellowBox.ignoreWarnings(["Warning:"]);

export default class SplashContainer extends Component {
    static navigationOptions = {
        header: null,
        headerBackTitle: null
	};

	constructor(props){
		super();

		this.state = {
		  isVisible : true,
          isReady: false,
          showIndicator: false
          
		}
    }
    
    async UNSAFE_componentWillMount() {

        global.dbManager = new BaseManager();

        // await TrackPlayer.setupPlayer();
        // await TrackPlayer.setupPlayer().then(async() => {
        //     // await TrackPlayer.registerPlaybackService(() => require('../../player-service/service.js'));
        
        //     TrackPlayer.updateOptions({
        //         stopWithApp: true,
        //         capabilities: [
        //           TrackPlayer.CAPABILITY_PLAY,
        //           TrackPlayer.CAPABILITY_PAUSE,
        //           TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        //           TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        //           TrackPlayer.CAPABILITY_STOP,
        //           TrackPlayer.CAPABILITY_PLAY_FROM_ID
        //         ],
        //         compactCapabilities: [
        //             TrackPlayer.CAPABILITY_PLAY,
        //             TrackPlayer.CAPABILITY_PAUSE,
        //             TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        //             TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        //             TrackPlayer.CAPABILITY_STOP,
        //             TrackPlayer.CAPABILITY_PLAY_FROM_ID
        //         ]
        //       });
        // });
        
        setTimeout(async() => {
            let login = 0;

            try {
                let signin_status = await AsyncStorage.getItem("signin");

                if(signin_status == "ok") {
                    let email = await AsyncStorage.getItem("email");
                    let password = await AsyncStorage.getItem("password");

                    console.log(email + "  " + password);

                    this.setState({showIndicator: true});
                    await fetch(global.server_url + '/api/auth/login', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            'email': email,
                            'password': password,
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        const error_code = data.error.code;
                        if(error_code == 402) {
                            Alert.alert("Waves!", 'Your account is disabled!');
                        } else if(error_code == 404 || error_code == 405) {
                            Alert.alert("Waves!", 'Email or Password is incorrect!');
                        } else if(error_code == 200) {
                            global.email = email;
                            global.password = password;
                            global.display_name = data.data.name;
                            global.country = data.data.country;
                            global.gender = data.data.gender;
                            global.birthday = data.data.dob;
                            global.phone_number = data.data.phone;
                            if(data.data.avatar_url == "") {
                                global.avatar_url = "";
                            } else {
                                global.avatar_url = global.server_url + data.data.avatar_url;
                            }
                            global.token = data.data.token;
                            if(data.data.billings != null) {
                                global.credit_status = true;
                                global.card_number = data.data.billings.cardnum;
                                global.credit_expiry = data.data.billings.expiredate;
                                global.credit_cvc = data.data.billings.cvc;
                            } else {
                                global.credit_status = false;
                            }
                            login = 1;

                        } else {
                            Alert.alert("Waves!", 'There is an error in server.');
                        }
                    })
                    .catch(function(error) {
                        Alert.alert('Waves!', error.message);
                    });
                    
                    this.setState({showIndicator: false});
                    
                }
            } catch(error) {

            }
            if(login == 1) {
                this.props.navigation.navigate('AppStack');
            } else {
                this.props.navigation.navigate("AuthStack");
            }
            
        }, 1000);
    }

    render() {
        return (
            <View style={styles.container}>
            {
                this.state.showIndicator &&
                <View style = {{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black', opacity: 0.3, zIndex: 100}}>
                    <View style = {{flex: 1}}>
                        <SkypeIndicator color = '#ffffff' />
                    </View>
                </View>
            }
                <Image style = {{width: '40%', height: '60%'}} resizeMode = {'contain'} source={require('../../images/logo.png')}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    safe_area: {
        width: '100%',
        height: safearea_height,
        alignItems: 'center',
        marginTop: top_inset,
        marginBottom: bottom_inset,
    },
});