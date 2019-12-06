import React, {Component} from 'react';

import {YellowBox, 
  KeyboardAvoidingView,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  ImageBackground,
  Image,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Alert
} from 'react-native';

import { SkypeIndicator } from 'react-native-indicators';

import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-community/async-storage';

import { STYLES, COLORS, FONTS} from '../../themes'
import global from '../../global/global';
import { BaseManager } from '../../database'

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var top_inset = Platform.OS == "ios" ? StaticSafeAreaInsets.safeAreaInsetsTop : 0;
var bottom_inset = Platform.OS == "ios" ? StaticSafeAreaInsets.safeAreaInsetsBottom : 30;
var safearea_height = deviceHeight - top_inset - bottom_inset;

class LoginContainer extends Component {
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
            
        }
    }

    async UNSAFE_componentWillMount() {
        
    }

    signin = async() => {
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

        this.setState({showIndicator: true});
        await fetch(global.server_url + '/api/auth/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'email': this.state.email,
                'password': this.state.password,
            })
        })
        .then(response => response.json())
        .then(async data => {
            const error_code = data.error.code;
            if(error_code == 402) {
                Alert.alert("Waves!", 'Your account is disabled!');
            } else if(error_code == 404 || error_code == 405) {
                Alert.alert("Waves!", 'Email or Password is incorrect!');
            } else if(error_code == 200) {
                global.email = this.state.email;
                global.password = this.state.password;
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
                if(data.data.billings != null) {
                    global.credit_status = true;
                    global.card_number = data.data.billings.cardnum;
                    global.credit_expiry = data.data.billings.expiredate;
                    global.credit_cvc = data.data.billings.cvc;
                } else {
                    global.credit_status = false;
                }
                global.token = data.data.token;

                try {
                    await AsyncStorage.setItem("signin", "ok");
                    await AsyncStorage.setItem("email", this.state.email);
                    await AsyncStorage.setItem("password", this.state.password);
                } catch(error) {
                    console.log(error.message);
                }

                this.props.navigation.navigate("AppStack");
            } else {
                Alert.alert("Waves!", 'There is an error in server. Please try again.');
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
                    <View style = {styles.safe_area}>
                        <KeyboardAwareScrollView style = {{width: '100%'}} showsVerticalScrollIndicator = {false}>
                            <View style = {{width: '100%', height: safearea_height * 0.3, justifyContent: 'center', alignItems: 'center'}}>
                                <Image style = {{width: '80%', height: '60%'}} resizeMode = {'contain'} source={require('../../images/logo.png')}/>
                            </View>
                            <View style = {{width: '100%', height: 320}}>
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
                                        <Text style = {styles.comment_text}>Password</Text>
                                    </View>
                                    <View style = {styles.input_text_view}>
                                        <TextInput style = {styles.input_text} placeholder = {'Password'} secureTextEntry = {true} onChangeText = {(text) => this.setState({password: text})}></TextInput>
                                    </View>
                                </View>
                                <View style = {{width: '100%', height: 20, alignItems: 'flex-end', justifyContent: 'center'}}>
                                    <TouchableOpacity onPress = {() => this.props.navigation.navigate("ForgotPassword")}>
                                        <Text style = {{fontSize: 16, color: '#ffffff', fontFamily: FONTS.type.Regular}}>Forgot Password</Text>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity style = {{width: '100%', height: 40, marginTop: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 5}} onPress = {() => this.signin()}>
                                    <Text style = {{fontSize: 20, color: '#000000', fontFamily: FONTS.type.Bold}}>Signin</Text>
                                </TouchableOpacity>
                                <View style = {{width: '100%', height: 40, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                                    <Text style = {{fontSize: 16, color: '#ffffff', fontFamily: FONTS.type.Regular}}>Create new account?  </Text>
                                    <TouchableOpacity onPress = {() => this.props.navigation.navigate("Register")}>
                                        <Text style = {{fontSize: 18, color: '#ffffff', fontFamily: FONTS.type.Bold}}>Signup</Text>
                                    </TouchableOpacity>
                                </View>
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
    }
});


export default LoginContainer