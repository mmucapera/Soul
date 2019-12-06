
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
import { SkypeIndicator } from 'react-native-indicators';


import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { TextInput, ForceTouchGestureHandler, ScrollView } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment';

import { countries_list } from '../../global/countries_list';

import { STYLES, COLORS, FONTS} from '../../themes';

import global from '../../global/global';
import PhoneInput from "../../components/phone-input";
import RNPickerSelect from 'react-native-picker-select';

var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
var top_inset = Platform.OS == "ios" ? StaticSafeAreaInsets.safeAreaInsetsTop : 0;
var bottom_inset = Platform.OS == "ios" ? StaticSafeAreaInsets.safeAreaInsetsBottom : 30;
var safearea_height = deviceHeight - top_inset - bottom_inset;
YellowBox.ignoreWarnings(["Warning:"]);
YellowBox.ignoreWarnings(["`-[RCTRootView cancelTouches]`"]);

const sports = [
    {
      label: 'Football',
      value: 'football',
    },
    {
      label: 'Baseball',
      value: 'baseball',
    },
    {
      label: 'Hockey',
      value: 'hockey',
    },
  ];

const options = {
    title: 'Select avtar...',
    // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    takePhotoButtonTitle: 'Select from Camera',
    chooseFromLibraryButtonTitle: 'Select from Library',
    storageOptions: {
        skipBackup: true,
        path: 'images',
        allowsEditing: true,
        width: '100%',
        height: '100%',
        aspect: [1, 1],
    },
};

export default class RegisterContainer extends Component {
    static navigationOptions = {
        header: null,
        headerBackTitle: null
	};

	constructor(props){
		super();

		this.state = {
            showIndicator: false,

            avatar_url: '',

            isDateTimePickerVisible: false,

            email: '',
            password: '',
            confirm_password: '',
            gender: 'Male',
            birthday: '',
            country: '',
            display_name: '',

            gender_view_show: false,

            show_verification_modal: false,
            verification_code: ''

          
		}
    }
    
    async UNSAFE_componentWillMount() {

    }

    avatar_selecet_alert() {
        ImagePicker.showImagePicker(options, (response) => {
            const {error, uri, originalRotation} = response;
            if (response.didCancel) {
                console.log('image picker cancelled');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                this.setState({avatar_url: response.uri});
                
            }
        });
    }

    showDateTimePicker = () => {
        this.setState({ 
            isDateTimePickerVisible: true,
        });
    };

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    handleDatePicked = date => {
        // console.warn("A date has been picked: ", date);
        
        this.setState({
            birthday: moment(date).format("YYYY-MM-DD"),
            birthday_date: date
        })
        
        this.hideDateTimePicker();
    }

    select_gender(gender) {
        this.setState({
            gender: gender,
            gender_view_show: false
        })
    }

    get_verficigation_code = async() => {
        Keyboard.dismiss();
        let regExpression = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        if(regExpression.test(this.state.email) === false) {
            Alert.alert("Waves!", 'Please use valid Email address.');
            return;
        };
        if(this.state.password.length < 6) {
            Alert.alert("Waves!", "Password have to be at least 6 characters");
            return;
        }
        if(this.state.password != this.state.confirm_password) {
            Alert.alert("Waves!", "Please confirm password.");
            return;
        }
        if(this.state.display_name == "") {
            Alert.alert("Waves!", "Please input display name.");
            return;
        }
        if(!this.phone.isValidNumber()) {
            Alert.alert("Waves!", "Please input valid phone number.");
            return;
        }
        if(this.state.country == null || this.state.country == "") {
            Alert.alert("Waves!", "Please select country.");
            return;
        }
        if(this.state.birthday == "") {
            Alert.alert("Waves!", "Please input your birthday.");
            return;
        }

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

    signup = async() => {
        Keyboard.dismiss();
        this.setState({
            show_verification_modal: false
        })

        var formData = new FormData();
        if(this.state.avatar_url !== '') {
            let localUri = this.state.avatar_url;
            let localUriNamePart = localUri.split('/');
            const fileName = localUriNamePart[localUriNamePart.length - 1];
            let localUriTypePart = localUri.split('.');
            const fileType = localUriTypePart[localUriTypePart.length - 1];

            formData.append('avatar', {
                uri: this.state.avatar_url,
                name: fileName,
                type: `image/${fileType}`,
            })

        } 

        formData.append('email', this.state.email);
        formData.append('password', this.state.password);
        formData.append('name', this.state.display_name);
        formData.append('country', this.state.country);
        formData.append('gender', this.state.gender);
        formData.append('dob', this.state.birthday);
        formData.append('vcode', this.state.verification_code);
        formData.append('phone', this.phone.getValue());
        console.log(this.phone.getValue() + "sdfsdf")

        this.setState({showIndicator: true});
        await fetch(global.server_url + '/api/auth/register', {
            method: 'POST',
            headers: {
                // 'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',

            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            const error_code = data.error.code;
            if(error_code == 200) {
                this.setState({
                    email: '',
                    password: '',
                    confirm_password: '',
                    gender: 'Male',
                    birthday: '',
                    country: '',
                    display_name: '',
                    verification_code: '',

                    show_verification_modal: false

                })
                Alert.alert("Waves!", "Register Successfully.",
                [
                    {text: 'Cancel', onPress: null},
                    {text: 'OK', onPress: () => this.props.navigation.navigate('Login')}
                ],
                { cancelable: true }
                )
            } else {
                if(error_code == 404) {
                    Alert.alert("Waves!", "Email is already exist. Please use other email address.",
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
                } else {
                    Alert.alert("Waves!", "There is an error in server. Please try again",
                    [
                        {text: 'OK', onPress: () => this.setState({show_verification_modal: true})}
                    ],
                    { cancelable: true }
                    );
                }
            }
        })
        .catch(function(error) {
            Alert.alert('Waves!', 'Network error.');
        })
        this.setState({showIndicator: false});
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.container}>
                {
                    this.state.showIndicator &&
                    <View style = {{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black', opacity: 0.4, zIndex: 100}}>
                        <View style = {{flex: 1}}>
                            <SkypeIndicator color = '#ffffff' />
                        </View>
                    </View>
                }
                {/* {
                    this.state.show_country_modal &&
                    <View style = {{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'black', opacity: 0.3, zIndex: 100}}/>
                } */}
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
                                <TouchableOpacity style = {{width: '40%', height: 40, borderRadius: 5, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center'}} onPress = {() => this.signup()}>
                                    <Text style = {{color: COLORS.text.black, fontSize: 18, fontFamily: FONTS.type.Medium,}}>Send</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                }
                
                    <View style = {styles.safe_area}>
                        <View style = {{width: '100%', height: safearea_height * 0.25, justifyContent: 'center', alignItems: 'center'}}>
                            <TouchableOpacity style = {{height: '80%', borderRadius:safearea_height * 0.25 * 0.8,  overflow: 'hidden'}} onPress = {() => this.avatar_selecet_alert()}>
                            {
                                this.state.avatar_url == "" &&
                                <Image style = {{height: '100%', aspectRatio: 1}} resizeMode = {'cover'} source = {require('../../images/avatar.png')}/>
                            }
                            {
                                this.state.avatar_url != "" &&
                                <Image style = {{height: '100%', aspectRatio: 1}} resizeMode = {'cover'} source = {{uri: this.state.avatar_url}}/>
                            }  
                            </TouchableOpacity>
                        </View>
                        <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisible}
                            onConfirm={this.handleDatePicked}
                            onCancel={this.hideDateTimePicker}
                            mode = {'date'}
                            date = {this.state.birthday == "" ? new Date() : this.state.birthday_date}
                        />
                        <View style = {{width: '100%', height: safearea_height * 0.75 - 110}}>
                            <KeyboardAwareScrollView style = {{width: '100%'}} showsVerticalScrollIndicator = {false}>
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
                                <View style = {styles.input_component}>
                                    <View style = {styles.input_comment}>
                                        <Text style = {styles.comment_text}>Confirm Password</Text>
                                    </View>
                                    <View style = {styles.input_text_view}>
                                        <TextInput style = {styles.input_text} placeholder = {'Confirm Password'} secureTextEntry = {true} onChangeText = {(text) => this.setState({confirm_password: text})}></TextInput>
                                    </View>
                                </View>
                                <View style = {styles.input_component}>
                                    <View style = {styles.input_comment}>
                                        <Text style = {styles.comment_text}>Display Name</Text>
                                    </View>
                                    <View style = {styles.input_text_view}>
                                        <TextInput style = {styles.input_text} placeholder = {'Display Name'} onChangeText = {(text) => this.setState({display_name: text})}></TextInput>
                                    </View>
                                </View>
                                <View style = {styles.input_component}>
                                    <View style = {styles.input_comment}>
                                        <Text style = {styles.comment_text}>Phone Number</Text>
                                    </View>
                                    <View style = {[styles.input_text_view, {borderRadius: 5, backgroundColor: '#222222', paddingLeft: 5}]}>
                                        <PhoneInput
                                            ref={ref => {
                                                this.phone = ref;
                                            }}
                                            autoFormat = {true}
                                            textStyle = {{color: '#ffffff'}}
                                        />
                                    </View>
                                </View>
                                <View style = {styles.input_component}>
                                    <View style = {styles.input_comment}>
                                        <Text style = {styles.comment_text}>Country</Text>
                                    </View>
                                    {/* <TouchableOpacity style = {[styles.input_text_view, {borderRadius: 5, backgroundColor: '#222222'}]} onPress = {() => this.setState({show_country_modal: true})}>
                                        <Text style = {{fontSize: 16, color: '#ffffff', marginLeft: 5, fontFamily: FONTS.type.Regular}}>{this.state.country}</Text>
                                    </TouchableOpacity> */}
                                    <View style = {[styles.input_text_view, {borderRadius: 5, backgroundColor: '#222222', paddingLeft: 5}]}>
                                        <RNPickerSelect
                                            placeholder={ {
                                                label: 'Select a Country...',
                                                value: null,
                                                color: '#9EA0A4',
                                            }}
                                            items={countries_list}
                                            onValueChange={value => {
                                                this.setState({country: value})
                                            }}
                                            style={{width: '100%', height: '100%'}}
                                            textInputProps = {{color: '#ffffff'}}
                                            // InputAccessoryView={() => null}
                                            // style={pickerSelectStyles}
                                            // value={this.state.favSport2}
                                        />
                                    </View>
                                </View>
                                <View style = {styles.input_component}>
                                    <View style = {styles.input_comment}>
                                        <Text style = {styles.comment_text}>Gender</Text>
                                    </View>
                                    {/* <View style = {styles.input_text_view}>
                                        <TextInput style = {styles.input_text} placeholder = {'Gender'}></TextInput>
                                    </View> */}
                                    <TouchableOpacity style = {[styles.input_text_view, {borderRadius: 5, backgroundColor: '#222222'}]} onPress = {() => this.setState({gender_view_show: true})}>
                                        <Text style = {{fontSize: 16, color: '#ffffff', marginLeft: 5, fontFamily: FONTS.type.Regular}}>{this.state.gender}</Text>
                                    </TouchableOpacity>
                                {
                                    this.state.gender_view_show &&
                                    <View style = {{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, borderRadius: 5, backgroundColor: '#222222'}}>
                                        <TouchableOpacity style = {{width: '100%', height: '50%', justifyContent: 'center',}} onPress = {() => this.select_gender('Male')}>
                                            <Text style = {{fontSize: 16, color: '#ffffff', marginLeft: 5, fontFamily: FONTS.type.Regular}}>Male</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style = {{width: '100%', height: '50%', justifyContent: 'center',}} onPress = {() => this.select_gender('Female')}>
                                            <Text style = {{fontSize: 16, color: '#ffffff', marginLeft: 5, fontFamily: FONTS.type.Regular}}>Female</Text>
                                        </TouchableOpacity>
                                    </View>
                                }
                                    
                                </View>
                                <View style = {styles.input_component}>
                                    <View style = {styles.input_comment}>
                                        <Text style = {styles.comment_text}>Birthday</Text>
                                    </View>
                                    <TouchableOpacity style = {[styles.input_text_view, {borderRadius: 5, backgroundColor: '#222222'}]} onPress = {() => this.showDateTimePicker()}>
                                        <Text style = {{fontSize: 16, color: '#ffffff', marginLeft: 5, fontFamily: FONTS.type.Regular}}>{this.state.birthday}</Text>
                                    </TouchableOpacity>
                                </View>
                            </KeyboardAwareScrollView>
                        </View>
                        
                        <TouchableOpacity style = {{width: '100%', height: 40, marginTop: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 5}} onPress = {() => this.get_verficigation_code()}>
                            <Text style = {{fontSize: 20, color: '#000000', fontFamily: FONTS.type.Bold}}>SignUp</Text>
                        </TouchableOpacity>
                        <View style = {{width: '100%', height: 40, marginBottom: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                            <Text style = {{fontSize: 16, color: '#ffffff', fontStyle: 'italic', fontFamily: FONTS.type.Regular}}>Already have account?  </Text>
                            <TouchableOpacity onPress = {() => this.props.navigation.navigate("Login")}>
                                <Text style = {{fontSize: 18, color: '#ffffff', fontFamily: FONTS.type.Bold}}>SignIn</Text>
                            </TouchableOpacity>
                        </View>
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
        justifyContent: 'center',

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