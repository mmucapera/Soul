import React, { Component } from 'react';
import { FlatList, SafeAreaView, ScrollView, View, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo'
import { SearchBar } from 'react-native-elements';
import { MinPlayerComponent } from '../../components/player';
import { AlbumVerticalComponent } from '../../components/albums';
import { STYLES, COLORS} from '../../themes'

import TrackPlayer, {STATE_PLAYING, STATE_PAUSED, STATE_BUFFERING, STATE_NONE, STATE_READY, STATE_STOPPED} from 'react-native-track-player';
import global from '../../global/global';
import { SkypeIndicator } from 'react-native-indicators';
import strings from '../../localization/strings';

const VIEWABILITY_CONFIG = {
    minimumViewTime: 3000,
    viewAreaCoveragePercentThreshold: 95,
    waitForInteraction: true,
};

class AlbumListContainer extends Component {

    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        const params = state.params || {};
        return {
            title: params.title ? params.title : "",
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
            showIndicator: false,
            music_playing: false,
            track_title:'',
            track_artist: '',
            track_artwork: '',

            search:'',
            items: [],
            global_items: [],

        };
    }
    componentDidMount() {
        this.props.navigation.setParams({ onHandleShowModalSort: this.onHandleShowModalSort });

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

    async UNSAFE_componentWillMount() {

        this.setState({showIndicator: true});
        await fetch(global.server_url + '/api/albums', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': global.token
            }
        })
        .then(response => response.json())
        .then(async data => {
            const error_code = data.error.code;
            if(error_code == 401) {
                Alert.alert("Waves!", 'Token error!');
            } else if(error_code == 402) {
                Alert.alert("Waves!", 'Your account is disabled!');
            } else if(error_code == 200) {
                var items = [];
                
                for(i = 0; i < data.data.length; i ++) {
                    items.push({
                        id: data.data[i].id,
                        name: data.data[i].name,
                        picture: global.server_url + data.data[i].img,
                    });
                }
                    
                this.setState({
                    items: items,
                    global_items: items,
                })
    
            } else {
                Alert.alert("Waves!", 'There is an error in server, Please try again.');
            }
        })
        .catch(function(error) {
            Alert.alert('Waves!', error.message);
        });
        
        this.setState({showIndicator: false});
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

    onPress = item => {
        this.props.navigation.navigate('Album', {
            album: item
        })
    }

    updateSearch = search => {
        this.setState({ search });
        var items = [];
        var global_items = this.state.global_items;
        for(i = 0; i < global_items.length; i ++) {
            if(global_items[i].name.indexOf(search) != -1) {
                items.push(global_items[i]);
            }
        }
        this.setState({
            items: items
        })
    };

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
        const { items, search } = this.state
        if(this.state.showIndicator)
        {
            return (
            <View style = {{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black', zIndex: 100}}>
                <View style = {{flex: 1}}>
                    <SkypeIndicator color = '#ffffff' />
                </View>
            </View>
            )
        }
        return (
            <SafeAreaView style={STYLES.container}>
                <ScrollView scrollEventThrottle={16}
                    style={STYLES.scrollContainer}>
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        viewabilityConfig={VIEWABILITY_CONFIG}
                        removeClippedSubviews
                        data={items}
                        refFlatlist={(ref) => { this.refFlatlist = ref; }}
                        keyExtractor={(item, index) => item + index || item.id || index.toString()}
                        listKey={(index) => index.toString()}
                        ListHeaderComponent={
                            <View style={{ marginBottom: 15 }}>
                                <SearchBar
                                    round={true}
                                    lightTheme={false}
                                    containerStyle={{ backgroundColor: COLORS.backgroundColor }}
                                    placeholder="Search"
                                    onChangeText={this.updateSearch}
                                    value={search}
                                />
                            </View>
                        }
                        renderItem={({ item, index }) => (
                            <AlbumVerticalComponent
                                index={index}
                                lastIndex={items.length - 1}
                                item={item}
                                onPress={this.onPress}
                            />
                        )}
                        numColumns={2}
                    />
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
export default AlbumListContainer