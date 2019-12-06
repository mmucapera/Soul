import React, {Component} from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, FlatList, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo'
import { MusicHorizontalComponent, MusicMediumHorizontalComponent } from '../../components/card';
import { PimaryButtonComponent } from '../../components/form';
import { MinPlayerComponent } from '../../components/player';
import { FlatListHeader } from '../../components/header';

import strings from '../../localization/strings';
import { STYLES, COLORS } from '../../themes'
import style from './styles'
import TrackPlayer, {STATE_PLAYING, STATE_PAUSED, STATE_BUFFERING, STATE_NONE, STATE_READY, STATE_STOPPED} from 'react-native-track-player';
import global from '../../global/global';
import {purchase_song} from '../../global/global_func';
import axios from 'axios';
import { SkypeIndicator } from 'react-native-indicators';
import { BaseManager } from '../../database'
const RNFS = require('react-native-fs');

const VIEWABILITY_CONFIG = {
  minimumViewTime: 3000,
  viewAreaCoveragePercentThreshold: 95,
  waitForInteraction: true,
};


class LibraryContainer extends Component {
    

    async UNSAFE_componentWillMount() {

        ///////////////  setup player  //////////
        await TrackPlayer.setupPlayer().then(async() => {
            // await TrackPlayer.registerPlaybackService(() => require('../../player-service/service.js'));
        
            TrackPlayer.updateOptions({
                stopWithApp: true,
                capabilities: [
                  TrackPlayer.CAPABILITY_PLAY,
                  TrackPlayer.CAPABILITY_PAUSE,
                  TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
                  TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
                  TrackPlayer.CAPABILITY_STOP,
                  TrackPlayer.CAPABILITY_PLAY_FROM_ID
                ],
                compactCapabilities: [
                    TrackPlayer.CAPABILITY_PLAY,
                    TrackPlayer.CAPABILITY_PAUSE,
                    TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
                    TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
                    TrackPlayer.CAPABILITY_STOP,
                    TrackPlayer.CAPABILITY_PLAY_FROM_ID
                ]
              });
        });

        // global.dbManager = new BaseManager();
        await global.dbManager.createPlaylistTable().then((value) => {
            console.log("/////////")
        }).catch((error) => {
            console.log("asdfasdfasdf   " + error.message)
        });

        await global.dbManager.createSongTable().then((value) => {
            console.log("/////////")
        }).catch((error) => {
            console.log("asdfasdfasdf   " + error.message)
        });


        const dir_audio_path = `${RNFS.CachesDirectoryPath}/${global.picture_dir}`;
        const dir_pic_path = `${RNFS.CachesDirectoryPath}/${global.picture_dir}`;
        await RNFS.mkdir(dir_audio_path)
        .then((result) => {
            console.log('result', result)
        })
        .catch((err) => {
            console.warn('err', err)
        })
        await RNFS.mkdir(dir_pic_path)
        .then((result) => {
            console.log('result', result)
        })
        .catch((err) => {
            console.warn('err', err)
        })
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
                this.send_song_play(trackQueue[i].id)
            }

            if(playing_state == STATE_PLAYING) {
                console.log("Playing")
            } else if(playing_state == STATE_PAUSED) {
                console.log("Pause")
            } else if(playing_state == STATE_BUFFERING) {
                console.log("Buffering")
            } else if(playing_state == STATE_NONE) {
                console.log("None")
            } else if(playing_state == STATE_READY) {
                console.log("Ready")
            } else if(playing_state == STATE_STOPPED) {
                console.log("Stopped")
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

        this.setState({showIndicator: true});
        await fetch(global.server_url + '/api/recents', {
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

                var recently_added = [];
                var recently_played = []
                
                for(i = 0; i < data.data.recent_added.length; i ++) {
                    var artist_name = "";
                    if(data.data.recent_added[i].artist == null) {
                        artist_name = "No Artist";
                    } else {
                        artist_name = data.data.recent_added[i].artist.name;
                    }
                    var album_id = 0;
                    if(data.data.recent_added[i].album_id != null) {
                        album_id = data.data.recent_added[i].album_id;
                    }
                    var artist_id = 0;
                    if(data.data.recent_added[i].artist_id != null) {
                        artist_id = data.data.recent_added[i].artist_id;
                    }
                    var playlist_id = 0;
                    if(data.data.recent_added[i].playlist_id != null) {
                        playlist_id = data.data.recent_added[i].playlist_id;
                    }
                    var purchase_status = true;
                    if(data.data.recent_added[i].price != 0) {
                        if(data.data.recent_added[i].user_trans.length > 0) {
                            purchase_status = false;
                        }
                    }

                    var track = {
                        id: data.data.recent_added[i].id,
                        artist: artist_name,
                        title: data.data.recent_added[i].name,
                        url: global.server_url + data.data.recent_added[i].audio,
                        artwork: global.server_url + data.data.recent_added[i].img,
                        db_id: data.data.recent_added[i].id,
                        price: data.data.recent_added[i].price,
                        album_id: album_id,
                        artist_id: artist_id,
                        playlist_id: playlist_id,
                        purchase_status: purchase_status
                    };
                    recently_added.push(track);
                }
                for(i = 0; i < data.data.recent_play.length; i ++) {
                    var artist_name = "";
                    if(data.data.recent_play[i].artist == null) {
                        artist_name = "No Artist";
                    } else {
                        artist_name = data.data.recent_play[i].artist.name;
                    }
                    var album_id = 0;
                    if(data.data.recent_play[i].album_id != null) {
                        album_id = data.data.recent_play[i].album_id;
                    }
                    var artist_id = 0;
                    if(data.data.recent_play[i].artist_id != null) {
                        artist_id = data.data.recent_play[i].artist_id;
                    }
                    var playlist_id = 0;
                    if(data.data.recent_play[i].playlist_id != null) {
                        playlist_id = data.data.recent_play[i].playlist_id;
                    }
                    var purchase_status = true;
                    
                    var track = {
                        id: data.data.recent_play[i].id,
                        artist: artist_name,
                        title: data.data.recent_play[i].name,
                        url: global.server_url + data.data.recent_play[i].audio,
                        artwork: global.server_url + data.data.recent_play[i].img,
                        db_id: data.data.recent_play[i].id,
                        price: data.data.recent_play[i].price,
                        album_id: album_id,
                        artist_id: artist_id,
                        playlist_id: playlist_id,
                        purchase_status: purchase_status
                    };
                    recently_played.push(track);
                }
                var items = {
                    recently_added: recently_added,
                    recently_played: recently_played
                }
                this.setState({
                    items: items
                })

            } else {
                Alert.alert("Waves!", 'There is an error in server, Please try again.');
            }
        })
        .catch(function(error) {
            Alert.alert('Waves!', "Network Error");
        });
        
        this.setState({showIndicator: false});

    }

    send_song_play(song_id) {
        // fetch(global.server_url + '/api/append_play/' + song_id, {
        //     method: 'POST',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //         'Authorization': global.token
        //     }
        // })
        // .then(response => response.json())
        // .then(async data => {
        //     console.log(data)
        // })
        // .catch(function(error) {
        //     Alert.alert('Waves!', 'Network error.');
        // });
        axios.post(global.server_url + '/api/append_play/' + song_id, null, {
            headers: {
                // 'Accept': 'application/json',
                // 'Content-Type': 'application/json',
                Authorization: global.token
            }
        })
        .then(function (response) {
            // console.log("response////////")
            console.log(response);
        })
        .catch(function (error) {
            // console.log("error//////////")
            // console.log(error);
        });
        
    }
  
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
        headerLeft: (<View style={STYLES.headerContainer}>
        <Text style={STYLES.headerContainer.title}>{strings.library}</Text>
        </View>),
        //   headerRight: (<View style={STYLES.headerContainer}>
        //     <TouchableOpacity onPress={() => params.onHandleShowModalSort() }>
        //       <Icon name="list" size={24} color={COLORS.text.primary} />
        //     </TouchableOpacity> 
        //   </View>) 
        };
    }

    constructor(props) {
        super(props);
        this.state = {
        music_playing: false,
        track_title:'',
        track_artist: '',
        track_artwork: '',

        track_queue_end: false,

        options:[
            {
                name: "Songs",
                icon: "music",
                active: false
            },
            {
                name: "Albums",
                icon: "album",
                active: false
            },
            {
                name: "Playlists",
                icon: "playlist-play",
                active: false
            },
            {
                name: "Favorites",
                icon: "heart",
                active: false
            }
        ],
        items:{
            recently_added: [
            //    {
            //      title: "Soft Life",
            //      name: "Terror Jr",
            //      url: "https://biobutterfly.com/wp-content/themes/musicapp/src/music/song7.mp3",
            //      picture:"https://is2-ssl.mzstatic.com/image/thumb/Music118/v4/f6/83/5e/f6835edd-43ac-fe7a-923c-44f486d88839/pr_source.png/1024x1024cc.jpg"
            //    },
            //    {
            //      title: "Happy Accidents",
            //      name: "Sara Bareilles",
            //      url: "https://biobutterfly.com/wp-content/themes/musicapp/src/music/song4.mp3",
            //      picture: "https://is4-ssl.mzstatic.com/image/thumb/Features118/v4/6e/40/10/6e40102c-4436-fb25-448a-0eb915944d59/mzl.dkdwxiaa.jpg/1024x1024cc.jpg"
            //    },
            //    {
            //      title: "A Fantasy Trip",
            //      name: "Kandi Landi",
            //      url: "https://biobutterfly.com/wp-content/themes/musicapp/src/music/song6.mp3",
            //      picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/26sz5.jpg"
            //    },
            //    {
            //      title: "The Good Life",
            //      name: "Cassarah",
            //      url: "https://biobutterfly.com/wp-content/themes/musicapp/src/music/song3.mp3",
            //      picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/28sz5.jpg"
            //    }
            ],
            recently_played:[
            //    {
            //      title: "Man of Dust",
            //      name: "kelly clarkson",
            //      url: "https://biobutterfly.com/wp-content/themes/musicapp/src/music/song2.mp3",
            //      picture:"https://is5-ssl.mzstatic.com/image/thumb/Features128/v4/bd/64/ed/bd64ed14-087f-3bec-0df1-d6be9c4baf52/mzl.endpunex.jpg/1024x1024cc.jpg"
            //    },
            //    {
            //      title: "Don't Recall",
            //      name: "Kard",
            //      url: "https://biobutterfly.com/wp-content/themes/musicapp/src/music/song1.mp3",
            //      picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/43sz5.jpg"
            //    },
            //    {
            //      title: "Streams",
            //      name: "Kard",
            //      url: "https://biobutterfly.com/wp-content/themes/musicapp/src/music/song3.mp3",
            //      picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/11sz5.jpg"
            //    },
            //    {
            //      title: "Uncovered",
            //      name: "Kard",
            //      url: "https://biobutterfly.com/wp-content/themes/musicapp/src/music/song8.mp3",
            //      picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/12sz5.jpg"
            //    },
            //    {
            //      title: "A Fantasy Trip",
            //      name: "Kandi Landi",
            //      url: "https://biobutterfly.com/wp-content/themes/musicapp/src/music/song6.mp3",
            //      picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/26sz5.jpg"
            //    },
            ]
        }
        };
    }

    onHandleShowModalSort = () => {
        const { options } = this.state
        this.props.navigation.navigate('SortModal', {
        options
        })
    }

    onPress = async(category, index) => {
        
        var track_list = [];
        if(category == "recently_added") {
            track_list = Object.assign([], this.state.items.recently_added);
        } else if(category == "recently_played") {
            track_list = Object.assign([], this.state.items.recently_played);;
        }
        ////  if this song is un-free, then return
        if(!track_list[index].purchase_status) {
            if(global.credit_status) {
                Alert.alert("Waves", "You need to purchase " + track_list[index].price +"$ to play this song. Would you like to purchase?",
                [
                    {text: 'Cancel', onPress: null},
                    {text: 'OK', onPress: () => {
                        purchase_song(track_list[index])
                    }
                    }
                ],
                { cancelable: true }
                );
                
            } else {
                Alert.alert("Waves", "This song is paid. Please register your credit card in Setting.");
            }
            return;
        }

        await TrackPlayer.reset();
        let selected_track = track_list[index];
        for(i = 0; i < track_list.length; i ++) {
            if(!track_list[i].purchase_status) {
                track_list.splice(i, 1);
            }
        }
        await TrackPlayer.add(track_list);
        for(i = 0; i < track_list.length; i ++) {
            if(selected_track.id == track_list[i].id) {
                await TrackPlayer.skip(String(track_list[i].id));
                break;
            }
        }
        await TrackPlayer.play()
    }

    onPressOption = item => {
        console.log("item==", item)
    }
    onHideUnderlay = item => {
        item.active = false
        this.setState({ item });
    }
    onShowUnderlay = item => {
        item.active = true
        this.setState({ item });
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
    //    global.dbManager.getAllPlaylists()
    //    .then((value) => {
    //         console.log(value)
    //    }).catch((error) => {

    //    })
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
        // global.dbManager.removePlaylistFromTable(6)
        // .then((value) => {
        //         console.log(value)
        // }).catch((error) => {

        // })
    }

  render() {
    const { items, options } = this.state;
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
          <ScrollView scrollEventThrottle={16}>
            {/* <View style={[style.container, { margin: 15 }]}>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  viewabilityConfig={VIEWABILITY_CONFIG}
                  removeClippedSubviews
                  data={this.state.options}
                  refFlatlist={(ref) => { this.refFlatlist = ref; }}
                  keyExtractor={(item, index) => item + index || item.id || index.toString()}
                  listKey={(index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <PimaryButtonComponent
                      index={index}
                      item={item}
                      onPress={this.onPressOption}
                      onHideUnderlay={this.onHideUnderlay}
                      onShowUnderlay={ this.onShowUnderlay}
                    />
                  )}
                 numColumns={2}
                />
            </View> */}

            <View style={[style.container]}>
              <FlatListHeader title={strings.recently_added} />
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    viewabilityConfig={VIEWABILITY_CONFIG}
                    removeClippedSubviews
                    data={this.state.items.recently_added}
                    refFlatlist={(ref) => { this.refFlatlist = ref; }}
                    keyExtractor={(item, index) => item + index || item.id || index.toString()}
                    listKey={(index) => index.toString()}
                    renderItem={({ item, index }) => (
                      <MusicHorizontalComponent
                        index={index}
                        lastIndex={this.state.items.recently_added.length - 1}
                        item={item} 
                        onPress={() => this.onPress("recently_added", index)}
                       />
                    )}
                  />
                </ScrollView>
            </View>
            
            <View style={[style.container, STYLES.scrollContainer]}> 
              <FlatListHeader title={strings.recently_played}/>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    viewabilityConfig={VIEWABILITY_CONFIG}
                    removeClippedSubviews
                    data={this.state.items.recently_played}
                    refFlatlist={(ref) => { this.refFlatlist = ref; }}
                    keyExtractor={(item, index) => item + index || item.id || index.toString()}
                    listKey={(index) => index.toString()}
                    renderItem={({ item, index }) => (
                      <MusicMediumHorizontalComponent
                        index={index}
                        lastIndex={this.state.items.recently_played.length - 1}
                        item={item}
                        onPress={() => this.onPress("recently_played", index)}
                      />
                    )}
                    numColumns={2}
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
  export default LibraryContainer