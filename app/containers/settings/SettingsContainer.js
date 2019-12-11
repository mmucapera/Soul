import React, {Component} from 'react';
import { View, Text, SafeAreaView, SectionList, ScrollView, Alert } from 'react-native';
import { MinPlayerComponent } from '../../components/player';
import ItemSetting from './settings';
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

class SettingsContainer extends Component {

    static navigationOptions = ({ }) => {
        return {
        headerLeft: (<View style={STYLES.headerContainer}>
        <Text style={STYLES.headerContainer.title}>{strings.settings}</Text></View>)
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
                    data: [
                        {
                            iconName: 'account-outline',
                            bagdeCount: '0',
                            name: 'My Profile',
                            iconNameRight: "arrow-right",
                            backgroundColor: "#233ba3"
                        },  
                        {
                            iconName: 'credit-card-settings',
                            bagdeCount: '0',
                            name: 'Top Up',
                            iconNameRight: "arrow-right",
                            backgroundColor: "#035e59"
                        },                       
                    ]
                },
                 {
                   data:[
                     {
                       iconName: 'airplane-off',
                       bagdeCount: '0',
                       name: 'Offline Mode',
                       iconNameRight: "arrow-right",
                       backgroundColor: "#006d05"
                     }
                   ],
                   description: strings.in_offline_mode_you_can_only_listen_to_previously_downloaded_playlist_and_albums
                 },
                 {
                   data:[
                    {
                        iconName: 'comment-question-outline',
                        bagdeCount: '0',
                        name: 'Privacy and Policy',
                        iconNameRight: "arrow-right",
                        backgroundColor: "#36bd54"
                    },
                     {
                       iconName: 'star',
                       bagdeCount: '0',
                       name: 'Rate Us',
                       iconNameRight: "arrow-right",
                       backgroundColor: "#ffc300"
                     },
                     {
                       iconName: 'information-outline',
                       bagdeCount: '0',
                       name: 'About',
                       iconNameRight: "arrow-right",
                       backgroundColor: "#a3a3a3"
                     },
                     {
                        iconName: 'logout-variant',
                        bagdeCount: '0',
                        name: 'Log out',
                        iconNameRight: "arrow-right",
                        backgroundColor: "#35d2f2"
                    },
                   ]
                 }
            ],
            offlineMode: false
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

    _onSettingButtonPress = item => {
        if(item.name == "My Profile") {
            this.props.navigation.navigate("MyAccount");
        }     
        
        else if(item.name == "Log out") {
            Alert.alert("Waves.", "Do you really want to logout?",
            [
                {text: 'Cancel', onPress: null},
                {text: 'OK', onPress: async() => {
                    try {
                        await AsyncStorage.setItem("signin", "false");
                        await AsyncStorage.setItem("email", "");
                        await AsyncStorage.setItem("password", "this.state.password");
                    } catch(error) {
                        console.log(error.message);
                    }
                    await TrackPlayer.stop();
                    this.props.navigation.navigate('AuthStack')}
                }
            ],
            { cancelable: true }
            )
        } 

        else if(item.name == "Top Up") {
            this.props.navigation.navigate("TopUp");
        }

        else if(item.name == "Privacy and Policy") {
            this.props.navigation.navigate("PrivacyPolicy");
        }

        else if(item.name == "Rate Us") {
        
        }

        else if(item.name == "About") {
            this.props.navigation.navigate("AboutUs");
        }  
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
            ListHeaderComponent={
              <HeaderComponent 
                avatar_url = {this.state.avatar_url}
                display_name = {this.state.display_name}
                email = {this.state.email}/>
            }
            ItemSeparatorComponent={renderSeparator}
            renderItem={({ item, index }) =>
              <ItemSetting
                item={item}
                index={index}
                offlineMode={offlineMode}
                toggleSwitch={this.toggleSwitch}
                onPress = {() => this._onSettingButtonPress(item)}
              />
            }
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
export default SettingsContainer