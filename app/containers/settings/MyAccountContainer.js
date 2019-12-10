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

import { MinPlayerComponent } from '../../components/player';

import { STYLES, COLORS, FONTS} from '../../themes'

import global from '../../global/global';
import strings from '../../localization/strings';
import TrackPlayer, {STATE_PLAYING, STATE_PAUSED, STATE_BUFFERING, STATE_NONE, STATE_READY, STATE_STOPPED} from 'react-native-track-player';

const VIEWABILITY_CONFIG = {
    minimumViewTime: 3000,
    viewAreaCoveragePercentThreshold: 95,
    waitForInteraction: true,
};

const picker_options = {
    title: 'Update Profile Picture',
   //  customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
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

class MyAccountContainer extends Component {

    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        const params = state.params || {};
        return {
            title: "My Profile",
        };
    }
    constructor(props) {
        super(props);
        this.state = {
            avatar_url: global.avatar_url,
            email: global.email,
            display_name: global.display_name,
            music_playing: false,
            track_title:'',
            track_artist: '',
            track_artwork: '' 
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
                        <Text style = {[{fontSize: 18, color: '#000000', fontFamily: FONTS.type.Bold,}]}>Update Password</Text>
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


export default MyAccountContainer