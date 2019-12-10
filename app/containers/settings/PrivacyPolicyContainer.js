import React, {Component} from 'react';
import { View, Text, SafeAreaView, SectionList, ScrollView, Alert } from 'react-native';
import { MinPlayerComponent } from '../../components/player';
import HeaderComponent from './header';
import strings from '../../localization/strings';
import { STYLES } from '../../themes'
import styles from './styles'

import TrackPlayer, {STATE_PLAYING, STATE_PAUSED, STATE_BUFFERING, STATE_NONE, STATE_READY, STATE_STOPPED} from 'react-native-track-player';
import global from '../../global/global';
import AsyncStorage from '@react-native-community/async-storage';

const renderSeparator = () => (
  <View style={[styles.seperatorBorderBottom]} />
);

class PrivacyPolicyContainer extends Component {

    static navigationOptions = ({ }) => {
        return {
        headerLeft: (<View style={STYLES.headerContainer}>
    //    <Text style={STYLES.headerContainer.title}>{strings.settings}</Text></View>)
        };
    }             
    constructor(props) {
        super(props);
        this.state = {
            showIndicator: false,
            music_playing: false,
            track_title:'',
            track_artist: '',
            track_artwork: '',

            avatar_url: '',
            display_name: '',
            email: '',
            menus: [
                 {
                   data:[

                   ],
                   description:"This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data. The Privacy Policy for soul has been created with the help of Privacy Policy Generator.We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, the terms used in this Privacy Policy have the same meanings as in our Terms and Conditions."
                 },
            ],
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

    componentWillUnmount() {
        this.onTrackStateChange.remove();
        this.onTrackQueueEnded.remove();
    }

    init_func = async() => {
        this.setState({
            avatar_url: global.avatar_url,
            display_name: global.display_name,
            email: global.email
        })

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


    toggleSwitch = (value) => {
        this.setState({ offlineMode: !value })
        // this.props.navigation.navigate("OfflineAppStack");
    }

    onPress = () =>{

    }

    showActionSheetLogOut = () => {

    }

    onHandlePlayer = async items => {
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
    const { menus, offlineMode } = this.state
    return (
      <SafeAreaView style={[STYLES.container]}>
        <ScrollView> 
          <View style={[STYLES.scrollContainer]}>
          <SectionList

            renderSectionFooter={({ section: { description } }) => (
              <View style={styles.sectionFooter}>
                {description &&
                  <Text style={styles.sectionFooter.description}>{description}</Text>
                }
              </View>
            )}
            sections={menus}
            keyExtractor={(item, index) => item + index}
          />
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
export default PrivacyPolicyContainer