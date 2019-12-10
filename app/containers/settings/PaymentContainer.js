import React, { Component } from 'react';
import { FlatList, 
    SafeAreaView, 
    ScrollView, 
    View, 
    TouchableOpacity,
    Image,
    StyleSheet,
    Text,
    TextInput,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo'
import { SearchBar } from 'react-native-elements';

import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";

import { MinPlayerComponent } from '../../components/player';

import { STYLES, COLORS, FONTS} from '../../themes'
import styles_setting from './styles/setting.style';
import { SkypeIndicator } from 'react-native-indicators';
import global from '../../global/global';
import strings from '../../localization/strings';
import TrackPlayer, {STATE_PLAYING, STATE_PAUSED, STATE_BUFFERING, STATE_NONE, STATE_READY, STATE_STOPPED} from 'react-native-track-player';

const VIEWABILITY_CONFIG = {
    minimumViewTime: 3000,
    viewAreaCoveragePercentThreshold: 95,
    waitForInteraction: true,
};


class PaymentContainer extends Component {

    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        const params = state.params || {};
        return {
            title: "Credit Card",
        };
    }
    constructor(props) {
        super(props);
        this.state = {
            isReady: false,

            showIndicator: false,

            card_data: {},
            credit_number: global.card_number,
            credit_expiry: global.credit_expiry,
            credit_cvc: global.credit_cvc,

            music_playing: false,
            track_title:'',
            track_artist: '',
            track_artwork: '',
        };
    }

    componentWillUnmount() {
        this.onTrackStateChange.remove();
        this.onTrackQueueEnded.remove();
    }

    componentDidMount() {
        this.props.navigation.setParams({ onHandleShowModalSort: this.onHandleShowModalSort });

        this.refs.credit_card_ref.setValues({number: this.state.credit_number});
        // this.refs.credit_card_ref.focus("expiry");
        // this.refs.credit_card_ref.setValues({expiry: this.state.credit_expiry});
        // this.refs.credit_card_ref.setValues({cvv: this.state.credit_cvc});

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

    onHandleShowModalSort = () => {
        const { options } = this.state
        this.props.navigation.navigate('SortModal', {
            options
        })
    }

    _onChange = (formData) => {
        this.setState({
            card_data: formData
        })
        // console.warn(JSON.stringify(formData, null, " "))
    };

    register_card = async() => {
        // console.warn(this.state.card_data);
        var card_data = this.state.card_data;
        console.log(card_data);
        if(!card_data.valid) {
            if(card_data.status.number != "valid") {
                Alert.alert("Waves", "Please input card number again or use valid card number.");
            } else if(card_data.status.expiry != "valid") {
                Alert.alert("Waves", "Please input valid expire date.");
            } else if(card_data.status.cvc != "valid") {
                Alert.alert("Waves", "Please input valid cvc code.");
            }
            return;
        }
        
        this.setState({showIndicator: true});
        await fetch(global.server_url + '/api/set_billinginfo', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': global.token
            },
            body: JSON.stringify({
                cardnum: card_data.values.number,
                expiredate: card_data.values.expiry,
                cvc: card_data.values.cvc
            })
        })
        .then(response => response.json())
        .then(data => {
            const error_code = data.error.code;
            if(error_code == 200) {
                Alert.alert("Waves!", "Credit card registration Success.");
            } else {
                if(error_code == 402) {
                    Alert.alert("Waves!", "Your account is disabled.");
                } else {
                    Alert.alert("Waves!", "There is an error in server. Please try again");
                }
            }
        })
        .catch(function(error) {
            Alert.alert('Waves!', "Network error.");
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
                this.state.showIndicator &&
                <View style = {{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black', opacity: 0.3, zIndex: 100}}>
                    <View style = {{flex: 1}}>
                        <SkypeIndicator color = '#ffffff' />
                    </View>
                </View>
            }
                <ScrollView scrollEventThrottle={16}
                    style={[STYLES.scrollContainer, {width: '90%'}]}>
                    <CreditCardInput
                        ref = 'credit_card_ref'
                        onChange={this._onChange} 
                        allowScroll = {true}
                        inputStyle = {{color:'#ffffff'}} 
                        labelStyle = {{color: '#ffffff'}}
                        inputContainerStyle = {{borderBottomWidth: 1, borderBottomColor: '#808080'}}/>
                    <View style = {{width: '100%', height: 40, marginTop: 40, alignItems: 'center'}}>
                        <TouchableOpacity style = {{width: '80%', height: '100%', borderRadius: 5, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center'}} onPress = {() => this.register_card()}>
                            <Text style = {{fontSize: 18, color: '#000000', fontFamily: FONTS.type.Bold}}>Register Card</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
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

});


export default PaymentContainer