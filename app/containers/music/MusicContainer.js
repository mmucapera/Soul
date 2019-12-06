import React, { Component } from 'react';
import { View, SafeAreaView, ScrollView, FlatList, Text, TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo'
import { MusicVerticalComponent } from '../../components/music';
import { MinPlayerComponent } from '../../components/player';
import { FlatListHeaderButton } from '../../components/header';
import { STYLES, COLORS} from '../../themes'
import styles from '../../components/player/min-player/style';
import strings from '../../localization/strings';
import TrackPlayer, {STATE_PLAYING, STATE_PAUSED, STATE_BUFFERING, STATE_NONE, STATE_READY, STATE_STOPPED} from 'react-native-track-player';
import global from '../../global/global';
import { SkypeIndicator } from 'react-native-indicators';

const RNFS = require('react-native-fs');

const VIEWABILITY_CONFIG = {
    minimumViewTime: 3000,
    viewAreaCoveragePercentThreshold: 95,
    waitForInteraction: true,
};


class MusicContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showIndicator: false,
            music_playing: false,
            track_title:'',
            track_artist: '',
            track_artwork: '',

            options: [
                {
                    name: "Play",
                    icon: "play",
                    active: false
                },
                {
                    name: "Shuffle",
                    icon: "shuffle-variant",
                    active: false
                },
            ],
            items:[]
        };
    }

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

    async UNSAFE_componentWillMount() {
        // if(global.music_play_style == "play") {
        //     this.setState({
        //         options: [
        //             {
        //                 name: "Play",
        //                 icon: "play",
        //                 active: true
        //             },
        //             {
        //                 name: "Shuffle",
        //                 icon: "shuffle-variant",
        //                 active: false
        //             },
        //         ]
        //     })
        // } else if(global.music_play_style == "shuffle") {
        //     this.setState({
        //         options: [
        //             {
        //                 name: "Play",
        //                 icon: "play",
        //                 active: false
        //             },
        //             {
        //                 name: "Shuffle",
        //                 icon: "shuffle-variant",
        //                 active: true
        //             },
        //         ]
        //     })
        // }
        this.setState({showIndicator: true});
        await fetch(global.server_url + '/api/songs', {
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
                    var artist_name = "";
                    if(data.data[i].artist == null) {
                        artist_name = "No Artist";
                    } else {
                        artist_name = data.data[i].artist.name;
                    }
                    var album_id = 0;
                    if(data.data[i].album != null) {
                        album_id = data.data[i].album.id;
                    }
                    var artist_id = 0;
                    if(data.data[i].artist != null) {
                        artist_id = data.data[i].artist.id;
                    }
                    var playlist_id = 0;
                    if(data.data[i].playlist != null) {
                        playlist_id = data.data[i].playlist.id;
                    }
                    var purchase_status = true;
                    if(data.data[i].price != 0) {
                        if(data.data[i].user_trans.length > 0) {
                            purchase_status = false;
                        }
                    }
                    items.push({
                        id: data.data[i].id,
                        artist: artist_name,
                        title: data.data[i].name,
                        url: global.server_url + data.data[i].audio,
                        artwork: global.server_url + data.data[i].img,
                        db_id: data.data[i].id,
                        price: 0,
                        downloading: false,
                        album_id: album_id,
                        artist_id: artist_id,
                        playlist_id: playlist_id,
                        purchase_status: purchase_status, // if user already purchase this song then true, else false
                    });
                }
                    
                this.setState({
                    items: items,
                })
    
            } else {
                Alert.alert("Waves!", 'There is an error in server, Please try again.');
            }
        })
        .catch(function(error) {
            Alert.alert('Waves', "Network error");
        });
        
        this.setState({showIndicator: false});
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

    onPress = async item => {
        if(!item.purchase_status) {
            if(global.credit_status) {
                Alert.alert("Waves", "You need to purchase " + item.price +"$ to play this song. Would you like to purchase?",
                [
                    {text: 'Cancel', onPress: null},
                    {text: 'OK', onPress: () => {
                        purchase_song(item)
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

        var track_list = Object.assign([], this.state.items);
        for(i = 0; i < track_list.length; i ++) {
            if(!track_list[i].purchase_status) {
                track_list.splice(i, 1);
            }
        }
        await TrackPlayer.add(track_list);
        await TrackPlayer.skip(String(item.id));
        await TrackPlayer.play()
    }

    onPressDownload = async(item) => {
        if(item.purchase_status) {
            this.download_file(item);
        } else {
            if(global.credit_status) {
                Alert.alert("Waves.", "You need to purchase " + item.price +"$ to download this song. Would you like to purchase?",
                [
                    {text: 'Cancel', onPress: null},
                    {text: 'OK', onPress: () => purchase_song(item)}
                ],
                { cancelable: true }
                )
            } else {
                Alert.alert("Waves", "This song is paid. Please register your credit card in Setting.");
            }
        }
    }

    async download_file(track_item) {

        let audio_filename = track_item.url.split('/').pop();
        let pic_filename = track_item.artwork.split('/').pop();
        const downloadDest_audio = `${RNFS.CachesDirectoryPath}/${global.audio_dir}/${audio_filename}`;
        const downloadDest_pic = `${RNFS.CachesDirectoryPath}/${global.picture_dir}/${pic_filename}`;
    
        const progress = data => {
            const percentage = ((100 * data.bytesWritten) / data.contentLength) | 0;
            console.log(`Progress  ${percentage}% `)
        };
    
        const begin = res => {
        
        };
    
        const progressDivider = 1;
        const background = false;

        var items = Object.assign([], this.state.items);
        for(index = 0; index < items.length; index ++) {
            if(items[index].id == track_item.id) {
                items[index].downloading = true;
            }
        }

        this.setState({ items: items })
    
        //////////  download audio file  /////////
        let ret_audio = RNFS.downloadFile({ fromUrl: track_item.url, toFile: downloadDest_audio, begin, progress, background, progressDivider });
        await ret_audio.promise.then(res => {
            console.log("file://" + downloadDest_audio)
        }).catch(err => {
            
        });
        //////////  download image file  /////////
        let ret_picture = RNFS.downloadFile({ fromUrl: track_item.artwork, toFile: downloadDest_pic, begin, progress, background, progressDivider });
        await ret_picture.promise.then(res => {
            console.log("file://" + downloadDest_pic)
        }).catch(err => {
            
        });

        items = Object.assign([], this.state.items);
        for(index = 0; index < items.length; index ++) {
            if(items[index].id == track_item.id) {
                items[index].downloading = false;
            }
        }
 
        this.setState({ items: items })

        ///////  add song to sqlite  ////////
        global.dbManager.addSongToTable(track_item.title, track_item.artist, downloadDest_audio, downloadDest_pic, track_item.db_id)
        .then((value) => {
            console.log("add song to sql is successed")
        }).catch((error) => {
            console.log("add song to sql is failed")
        })
    }

    onPressOption = async item => {
        if(item.name == "Play") {
            if(!this.state.options[0].active) {
                await TrackPlayer.reset();
                var track_list = Object.assign([], this.state.items);
                await TrackPlayer.add(track_list);
                await TrackPlayer.play();

                this.setState({
                    options: [
                        {
                            name: "Play",
                            icon: "play",
                            active: true
                        },
                        {
                            name: "Shuffle",
                            icon: "shuffle-variant",
                            active: false
                        },
                    ]
                })
                // global.music_play_style = "play";
            }
        } else if(item.name == "Shuffle") {
            if(!this.state.options[1].active) {
                await TrackPlayer.reset();
                var track_list = Object.assign([], this.state.items);
                for (let i = track_list.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [track_list[i], track_list[j]] = [track_list[j], track_list[i]];
                }
                this.setState({
                    items: track_list
                })
                await TrackPlayer.add(track_list);
                await TrackPlayer.play();
                this.setState({
                    options: [
                        {
                            name: "Play",
                            icon: "play",
                            active: false
                        },
                        {
                            name: "Shuffle",
                            icon: "shuffle-variant",
                            active: true
                        },
                    ]
                })
                // global.music_play_style = "shuffle";
            }
        }
    }
    onHideUnderlay = item => {
        // item.active = false
        // this.setState({ item });
        // console.log("onHideUnderlay==", item)
    }
    onShowUnderlay = item => {
        // item.active = true
        // this.setState({ item });
        // console.log("onShowUnderlay==", item)
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
        const { items, options } = this.state
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
                        showsVerticalScrollIndicator={false}
                        viewabilityConfig={VIEWABILITY_CONFIG}
                        ListHeaderComponent={
                           <View>
                                <FlatListHeaderButton
                                    onPress={this.onPressOption}
                                    onHideUnderlay={this.onHideUnderlay}
                                    onShowUnderlay={this.onShowUnderlay}
                                    items={options}
                                />
                                <View style={styles.containerInfo}>
                                    <Text style={styles.containerInfo.title}>
                                        {strings.a_collection_of_all_music_recommended_just_for_you_we_hope_you_like_it}
                                    </Text>
                                </View>
                           </View>
                        }
                        removeClippedSubviews
                        data={items}
                        refFlatlist={(ref) => { this.refFlatlist = ref; }}
                        keyExtractor={(item, index) => item + index || item.id || index.toString()}
                        listKey={(index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <MusicVerticalComponent
                                index={index}
                                lastIndex={items.length - 1}
                                item={item}
                                onPress={this.onPress}
                                onPressDownload = {this.onPressDownload}
                            />
                        )}
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
export default MusicContainer