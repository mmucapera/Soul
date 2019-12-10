import React, { Component } from 'react';
import { FlatList, 
    SafeAreaView, 
    ScrollView, 
    View, 
    TouchableOpacity,
    Image,
    StyleSheet,
    Text,
    TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo'
import { SearchBar } from 'react-native-elements';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ImagePicker from 'react-native-image-picker';
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment';

import { MinPlayerComponent } from '../../components/player';

import { STYLES, COLORS, FONTS} from '../../themes'
import styles_setting from './styles/setting.style';

import global from '../../global/global';
import PhoneInput from "../../components/phone-input";
import RNPickerSelect from 'react-native-picker-select';
import { countries_list } from '../../global/countries_list';
import strings from '../../localization/strings';
import TrackPlayer, {STATE_PLAYING, STATE_PAUSED, STATE_BUFFERING, STATE_NONE, STATE_READY, STATE_STOPPED} from 'react-native-track-player';

const VIEWABILITY_CONFIG = {
    minimumViewTime: 3000,
    viewAreaCoveragePercentThreshold: 95,
    waitForInteraction: true,
};

const picker_options = {
    title: 'Update Profile Picture',
     customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
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

class TopUpContainer extends Component {

    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        const params = state.params || {};
        return {
            title: "My Profile",
            // headerRight: (<View style={STYLES.headerContainer}>
            //     <TouchableOpacity onPress={() => params.onHandleShowModalSort()}>
            //         <Icon name="list" size={24} color={COLORS.text.primary} />
            //     </TouchableOpacity>
            // </View>) 
        };
    }
    constructor(props) {
        super(props);
        this.state = {
            avatar_url: global.avatar_url,
            isDateTimePickerVisible: false,
            email: global.email,
            password: global.password,
            gender: global.gender,
            birthday: global.birthday,
            country: global.country,
            display_name: global.display_name,
            phone_number: global.phone_number,

            gender_view_show: false,

            music_playing: false,
            track_title:'',
            track_artist: '',
            track_artwork: '',


            search:'',
            items: [
                {
                    name: "Breathe",
                    picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/125sz5.jpg"
                },
                {
                    name: "Stay as you are",
                    picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/126sz5.jpg"
                },
                {
                    name: "Shooting Star",
                    picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/127sz5.jpg"
                },
                {
                    name: "Something",
                    picture: "https://is2-ssl.mzstatic.com/image/thumb/Music124/v4/91/f0/95/91f09528-2155-6a1d-45c0-0208e8efe059/886447489642.jpg/1024x0w.jpg"
                },
                {
                    name: "Alone Together",
                    picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/131sz5.jpg"
                }
            ]
        };
    }

    componentDidMount(){
        this.props.navigation.addListener('willFocus', this.init_func.bind(this));

        this.onTrackStateChange = TrackPlayer.addEventListener('playback-state', async (data) => {
            
            let playing_state = await TrackPlayer.getState();
            if(playing_state == STATE_PLAYING) {
                this.setState({
                    music_playing: true
                });
                
            } else {
                this.setState({
                    music_playing: false
                });
            }

            if(playing_state == STATE_PLAYING) {
                const currentTrackID = await TrackPlayer.getCurrentTrack();
                const trackQueue = await TrackPlayer.getQueue();
                for(i = 0; i < trackQueue.length; i ++) {
                    if(currentTrackID == trackQueue[i].id) {
                        break;
                    }
                }
                this.setState({
                    track_title: trackQueue[i].title,
                    track_artist: trackQueue[i].artist,
                    track_artwork: trackQueue[i].artwork
                });
                // this.send_song_play(trackQueue[i].id)
            }
        });

        this.onTrackQueueEnded = TrackPlayer.addEventListener('playback-queue-ended', async (data) => {
            console.log("queue ended")
            const trackQueue = await TrackPlayer.getQueue();
            if(trackQueue.length == 1) {
                await TrackPlayer.seekTo(0);
            } else {
                await TrackPlayer.skip(trackQueue[0].id);
                await TrackPlayer.play();
            }
        });
    }

    init_func = async() => {

        let playing_state = await TrackPlayer.getState();
        if(playing_state != STATE_PLAYING) {
            this.setState({
                music_playing: false
            })
        } else {
            this.setState({
                music_playing: true
            })
        }
    
        const currentTrackID = await TrackPlayer.getCurrentTrack();
        if(currentTrackID != null) {
          const trackQueue = await TrackPlayer.getQueue();
          for(i = 0; i < trackQueue.length; i ++) {
              if(currentTrackID == trackQueue[i].id) {
                  break;
              }
          }
          this.setState({
              track_title: trackQueue[i].title,
              track_artist: trackQueue[i].artist,
              track_artwork: trackQueue[i].artwork
          });
        }
    }

    componentWillUnmount() {
        this.onTrackStateChange.remove();
        this.onTrackQueueEnded.remove();
    }
    
    onHandleShowModalSort = () => {
        const { options } = this.state
        this.props.navigation.navigate('SortModal', {
            options
        })
    }
    // onPress = item => {
    //     console.log("item==", item)
    // }
    // updateSearch = search => {
    //     this.setState({ search });
    // };
    // onHandlePlayer = items => {
    //     this.props.navigation.navigate('Player')
    // }

    avatar_selecet_alert() {
        ImagePicker.showImagePicker(picker_options, (response) => {
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

        this.setState({showIndicator: true});
        await fetch(global.server_url + '/api/auth//api/update_profile', {
            method: 'POST',
            headers: {
                // 'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',

            },
            body: formData
        })
        .then(response => response.json())
        .then(async data => {
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
                global.email = this.state.email;
                global.password = this.state.password;
                global.display_name = this.state.display_name;
                global.country = this.state.country;
                global.gender = this.state.gender;
                global.birthday = this.state.birthday;
                global.phone_number = this.state.phone_number;
                if(data.data.avatar_url == "") {
                    global.avatar_url = "";
                } else {
                    global.avatar_url = global.server_url + data.data.avatar_url;
                }
                global.token = data.data.token;

                try {
                    await AsyncStorage.setItem("signin", "ok");
                    await AsyncStorage.setItem("email", this.state.email);
                    await AsyncStorage.setItem("password", this.state.password);
                } catch(error) {
                    console.log(error.message);
                }
                Alert.alert("Waves!", "Your Account Update Successfully.")
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

    onHandlePlayer = async(items) => {
        const currentTrackID = await TrackPlayer.getCurrentTrack();
        if(currentTrackID != null) {
            let playing_state = await TrackPlayer.getState();
            var play_status = ""
            if(playing_state == STATE_PLAYING) {
                plsy_status = strings.now_playing;
            } else if(playing_state == STATE_PAUSED) {
                plsy_status = strings.now_pause;
            } else {
                plsy_status = strings.now_stop;
            }
            this.props.navigation.navigate('Player', {header_now_status_string: play_status});
        }
    }

    music_next_button_func = async() => {
        const currentTrackID = await TrackPlayer.getCurrentTrack();
        const trackQueue = await TrackPlayer.getQueue();
        var i = 0;
        for(i = 0; i < trackQueue.length; i ++) {
          if(currentTrackID == trackQueue[i].id) {
            break;
          }
        }
        if(i == trackQueue.length - 1) {
          await TrackPlayer.skip(trackQueue[0].id)
        } else {
          await TrackPlayer.skipToNext();
        }
        await TrackPlayer.play();
      }
    
    music_play_button_func = async() => {
        const trackQueue = await TrackPlayer.getQueue();
        
        if(trackQueue.length > 0) {
            
            let playing_state = await TrackPlayer.getState();
            if(playing_state != STATE_PLAYING) {
                await TrackPlayer.play();
            } else {
                await TrackPlayer.pause();
            }
        }
    }

    render() {
        const { items, search } = this.state
        return (
            <SafeAreaView style={[STYLES.container, {alignItems: 'center'}]}>
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
                <KeyboardAwareScrollView scrollEventThrottle={16}
                    style={[STYLES.scrollContainer, {width: '90%'}]}>
                    <View style = {{width: '100%', height: 150, justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity style = {{height: '80%', aspectRatio: 1, borderRadius: 150,  overflow: 'hidden'}} onPress = {() => this.avatar_selecet_alert()}>
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
                    <View style = {styles.input_component}>
                        <View style = {styles.input_comment}>
                            <Text style = {styles.comment_text}>Email</Text>
                        </View>
                        <View style = {styles.input_text_view}>
                            <TextInput editable={false}  style = {styles.input_text} placeholder = {'Email'} >{this.state.email}</TextInput>
                        </View>
                    </View>
                    <View style = {styles.input_component}>
                        <View style = {styles.input_comment}>
                            <Text style = {styles.comment_text}>Display Name</Text>
                        </View>
                        <View style = {styles.input_text_view}>
                            <TextInput style = {styles.input_text} placeholder = {'Display Name'} onChangeText = {(text) => this.setState({display_name: text})}>{this.state.display_name}</TextInput>
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



                    <TouchableOpacity style = {{width: '100%', height: 40, marginTop: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 5}}>
                        <Text style = {[{fontSize: 18, color: '#000000', fontFamily: FONTS.type.Bold,}]}>Update Profile</Text>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
                <MinPlayerComponent 
                    onPress={this.onHandlePlayer}
                    music_playing = {this.state.music_playing}
                    track_title = {this.state.track_title}
                    track_artist = {this.state.track_artist}
                    track_artwork = {this.state.track_artwork}
                    music_play_button_func = {() => this.music_play_button_func()}
                    music_next_button_func = {() => this.music_next_button_func()}/>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     backgroundColor: '#000000',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    // },
    // safe_area: {
    //     width: '90%',
    //     height: safearea_height,
    //     alignItems: 'center',
    //     marginTop: top_inset,
    //     marginBottom: bottom_inset,
    // },
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


export default TopUpContainer