
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
    Linking
} from 'react-native';
// import { SkypeIndicator } from 'react-native-indicators';


import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { TextInput } from 'react-native-gesture-handler';

import { STYLES, COLORS, FONTS} from '../../themes'

import { SkypeIndicator } from 'react-native-indicators';
import global from '../../global/global';

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var top_inset = Platform.OS == "ios" ? StaticSafeAreaInsets.safeAreaInsetsTop : 0;
var bottom_inset = Platform.OS == "ios" ? StaticSafeAreaInsets.safeAreaInsetsBottom : 30;
var safearea_height = deviceHeight - top_inset - bottom_inset;
YellowBox.ignoreWarnings(["Warning:"]);
YellowBox.ignoreWarnings(["`-[RCTRootView cancelTouches]`"]);

export default class ForgotPassword extends Component {
    static navigationOptions = {
        header: null,
        headerBackTitle: null
	};

	constructor(props){
		super();

		this.state = {
            isVisible : true,
            isReady: false,
            showIndicator: false,
            email: '',
            password: '',
            confirm: '',
          
		}
    }
    
    async UNSAFE_componentWillMount() {
    }

    get_verificationcode = async() => {
        Keyboard.dismiss();
        let regExpression = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        if(regExpression.test(this.state.email) === false) {
            Alert.alert("Warning!", 'Please input valid Email address.');
            return;
        };
        if(this.state.password.length < 6 ) {
            Alert.alert("Warning!", 'Password have to be at least 6 characters.');
            return;
        };
        if(this.state.password != this.state.confirm ) {
            Alert.alert("Warning!", 'Please confirm password.');
            return;
        };
        this.setState({showIndicator: true});
        await fetch(global.server_url + '/api/auth/getVerification', {
            method: 'POST',
            headers: {
                // 'Accept': 'application/json',
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({
                email: this.state.email
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const error_code = data.error.code;
            if(error_code == 200) {
                this.setState({
                    show_verification_modal: true
                })
            } else {
                if(error_code == 602) {
                    Alert.alert("Waves!", "Verification code send fail. Please try again.");
                } else {
                    Alert.alert("Waves!", "There is an error in server. Please try again");
                }
            }
        })
        .catch(function(error) {
            Alert.alert('Waves!', 'Network error.');
        })
        this.setState({showIndicator: false});
    }

    forgot_password = async() => {
        

        this.setState({showIndicator: true});
        await fetch(global.server_url + '/api/auth/reset_password', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'email': this.state.email,
                'newpassword': this.state.password,
                'vcode': this.state.verification_code
            })
        })
        .then(response => response.json())
        .then(async data => {
            console.log(data);
            this.setState({
                show_verification_modal: false
            })
            const error_code = data.error.code;
            if(error_code == 402) {
                Alert.alert("Waves!", 'Your account is disabled!',
                [
                    {text: 'OK', onPress: () => this.setState({show_verification_modal: true})}
                ],
                { cancelable: true }
                );
            } else if(error_code == 404) {
                Alert.alert("Waves!", 'Your email is incorrect. Please try again!',
                [
                    {text: 'OK', onPress: () => this.setState({show_verification_modal: true})}
                ],
                { cancelable: true }
                );
            } else if(error_code == 407) {
                Alert.alert("Waves!", "Verification Code doesn't match. Please input verification code again.",
                [
                    {text: 'OK', onPress: () => this.setState({show_verification_modal: true})}
                ],
                { cancelable: true }
                );
            }else if(error_code == 200) {
                Alert.alert("Waves!", "Password Successfully Changed.",
                [
                    {text: 'Cancel', onPress: null},
                    {text: 'OK', onPress: () => this.props.navigation.navigate('Login')}
                ],
                { cancelable: true }
                );
            } else {
                Alert.alert("Waves!", 'There is an error in server, Please try again.');
            }
        })
        .catch(function(error) {
            Alert.alert('Waves!', "Network error");
        });
        
        this.setState({showIndicator: false});
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.container}>
                {
                    this.state.showIndicator &&
                    <View style = {{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black', opacity: 0.3, zIndex: 100}}>
                        <View style = {{flex: 1}}>
                            <SkypeIndicator color = '#ffffff' />
                        </View>
                    </View>
                }
                {
                    this.state.show_verification_modal &&
                    <View style = {{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 100}}>
                        <View style = {{width: '80%', height: 200, backgroundColor: '#303030', borderRadius: 5}}>
                            <View style = {{width: '100%', height: '30%', alignItems: 'center', justifyContent: 'center'}}>
                                <Text style = {{color: COLORS.text.white, fontSize: 18, fontFamily: FONTS.type.Medium,}}>Verification Code</Text>
                            </View>
                            <View style = {{width: '100%', height: '30%', alignItems: 'center', justifyContent: 'center'}}>
                                <TextInput style = {{width: '80%', height: 40, fontSize: 15, color: '#ffffff', backgroundColor: '#222222', paddingLeft: 5, borderRadius: 5, fontFamily: FONTS.type.Regular}} 
                                    placeholder = {'Verification Code'}
                                    placeholderTextColor = {'#808080'}
                                    keyboardType = {"number-pad"}
                                    onChangeText = {(text) => this.setState({verification_code: text})}>
                                    {this.state.verification_code}
                                </TextInput>
                            </View>
                            <View style = {{width: '100%', height: '40%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                <TouchableOpacity style = {{width: '40%', height: 40, borderRadius: 5, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', marginRight: 10}} onPress = {() => this.setState({show_verification_modal: false})}>
                                    <Text style = {{color: COLORS.text.black, fontSize: 18, fontFamily: FONTS.type.Medium,}}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style = {{width: '40%', height: 40, borderRadius: 5, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center'}} onPress = {() => this.forgot_password()}>
                                    <Text style = {{color: COLORS.text.black, fontSize: 18, fontFamily: FONTS.type.Medium,}}>Send</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                }
                    <View style = {styles.safe_area}>
                        <KeyboardAwareScrollView style = {{width: '100%'}} showsVerticalScrollIndicator = {false}>
                            <View style = {{width: '100%', height: safearea_height * 0.3, justifyContent: 'center', alignItems: 'center'}}>
                                <Image style = {{width: '80%', height: '80%'}} resizeMode = {'contain'} source={require('../../images/logo.png')}/>
                            </View>
                            <View style = {{width: '100%', height: 380}}>
                                <View style = {styles.input_component}>
                                    <View style = {styles.input_comment}>
                                        <Text style = {styles.comment_text}>Email</Text>
                                    </View>
                                    <View style = {styles.input_text_view}>
                                        <TextInput style = {styles.input_text} placeholder = {'Email'} onChangeText = {(text) => this.setState({email: text})}></TextInput>
                                    </View>
                                </View>
                                <View style = {styles.input_component}>
                                    <View style = {styles.input_comment}>
                                        <Text style = {styles.comment_text}>New Password</Text>
                                    </View>
                                    <View style = {styles.input_text_view}>
                                        <TextInput style = {styles.input_text} placeholder = {'Password'} secureTextEntry = {true} onChangeText = {(text) => this.setState({password: text})}></TextInput>
                                    </View>
                                </View>
                                <View style = {styles.input_component}>
                                    <View style = {styles.input_comment}>
                                        <Text style = {styles.comment_text}>Confirm Password</Text>
                                    </View>
                                    <View style = {styles.input_text_view}>
                                        <TextInput style = {styles.input_text} placeholder = {'Confirm Password'} secureTextEntry = {true} onChangeText = {(text) => this.setState({confirm: text})}></TextInput>
                                    </View>
                                </View>
                                <TouchableOpacity style = {[styles.button, {marginTop: 20,}]} onPress = {() => this.get_verificationcode()}>
                                    <Text style = {{fontSize: 18, color: '#000000', fontFamily: FONTS.type.Bold}}>Forgot Password</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style = {[styles.button, {marginTop: 10,}]} onPress = {() => this.props.navigation.navigate("Login")}>
                                    <Text style = {{fontSize: 18, color: '#000000', fontFamily: FONTS.type.Bold}}>Signin</Text>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAwareScrollView>
                    </View>
                </View>
            </TouchableWithoutFeedback>
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
        width: '90%',
        height: safearea_height,
        alignItems: 'center',
        marginTop: top_inset,
        marginBottom: bottom_inset,
    },
    input_component: {
        width: '100%', 
        height: 70, 
        marginBottom: 20
    },
    input_comment: {
        width: '100%', 
        height: '40%', 
        justifyContent: 'center'
    },
    comment_text: {
        fontSize: 14, 
        color: '#808080',
        fontFamily: FONTS.type.Regular
    },
    input_text_view: {
        width: '100%', 
        height: '60%', 
        justifyContent: 'center'
    },
    input_text: {
        width: '100%', 
        height: '100%', 
        fontSize: 16, 
        color: '#ffffff', 
        backgroundColor: '#222222', 
        paddingLeft: 5, 
        borderRadius: 5,
        fontFamily: FONTS.type.Regular
    },
    button: {
        width: '100%', 
        height: 40, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#ffffff', 
        borderRadius: 5
    }
});