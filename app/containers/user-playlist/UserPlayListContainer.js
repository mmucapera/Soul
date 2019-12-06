import React, {Component} from 'react';
import { View, Text, SafeAreaView, ScrollView, FlatList, Alert, TouchableOpacity, Image, TextInput} from 'react-native';
import _ from "lodash";
import strings from '../../localization/strings';
import { TrendingMusicHorizontalComponent, MusicVerticalComponent } from '../../components/music';
import Icon from 'react-native-vector-icons/Entypo'
import { ArtistHorizontalComponent} from '../../components/artists';
import { AlbumHorizontalComponent } from '../../components/albums';
import { PlaylistHorizontalComponent } from '../../components/playlist';
import { FlatListHeader } from '../../components/header';
import { MinPlayerComponent } from '../../components/player';
import { CONSTANT_SEEL_ALL } from '../../utils/constant'
import { STYLES, COLORS, FONTS } from '../../themes'
import style from './styles'
import TrackPlayer, {STATE_PLAYING, STATE_PAUSED, STATE_BUFFERING, STATE_NONE, STATE_READY, STATE_STOPPED} from 'react-native-track-player';
import global from '../../global/global';
import { SkypeIndicator } from 'react-native-indicators';
import { BaseManager } from '../../database'
import ImagePicker from 'react-native-image-picker';
const RNFS = require('react-native-fs');

const VIEWABILITY_CONFIG = {
  minimumViewTime: 3000,
  viewAreaCoveragePercentThreshold: 95,
  waitForInteraction: true,
};

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

class UserPlaylistContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showIndicator: false,
            music_playing: false,
            track_title:'',
            track_artist: '',
            track_artwork: '',
        
            items: [],
            trending: [],
            artists: [],
            albums: [],
            playlists:[],

            show_add_playlist_modal: false,
            new_playlist_pic_url: '',
            new_playlist_name: '',
        };
    }
    
    UNSAFE_componentWillMount() {
    
    }

    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        const params = state.params || {};
        return {
            headerLeft: (<View style={STYLES.headerContainer}>
            <Text style={[STYLES.headerContainer.title]}>{strings.userplaylist}</Text>
            </View>),
            headerRight: (<View style={STYLES.headerContainer}>
                <TouchableOpacity onPress={() => params.add_playlist_modal()}>
                    <Icon name="plus" size={24} color={COLORS.text.primary} />
                </TouchableOpacity>
            </View>) 
        };
    }

    componentDidMount() { 

        this.props.navigation.setParams({ add_playlist_modal: this.add_playlist_modal.bind(this) });

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

        ////  get playlist and songs
        await this.get_playlist_songs_sqlite();

        // this.setState({
        //     playlists: [
        //         {
        //             id: 1,
        //             name: "1111",
        //             picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/26sz5.jpg"
        //         },
        //         {
        //             id: 2,
        //             name: "22222",
        //             picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/26sz5.jpg"
        //         },
        //         {
        //             id: 3,
        //             name: "33333",
        //             picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/26sz5.jpg"
        //         },
        //         {
        //             id: 4,
        //             name: "44444",
        //             picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/26sz5.jpg"
        //         },
        //     ],
        //     items: [
        //         {
        //             id: "111111",
        //             artist: "artist1111",
        //             title: "title111111",
        //             url: "https://biobutterfly.com/wp-content/themes/musicapp/src/music/song6.mp3",
        //             artwork: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/26sz5.jpg",
        //             db_id: 111111,
        //             playlist_id: 1,
        //             down_count: 0,
        //             price: 0,
        //             purchase_status: true, // if user already purchase this song then true, else false
        //             downloading: false

        //        },
        //        {
        //             id: "222222",
        //             artist: "artist2222",
        //             title: "title22222",
        //             url: "https://biobutterfly.com/wp-content/themes/musicapp/src/music/song6.mp3",
        //             artwork: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/26sz5.jpg",
        //             db_id: 22222,
        //             playlist_id: 2,
        //             down_count: 0,
        //             price: 0,
        //             purchase_status: true, // if user already purchase this song then true, else false
        //             downloading: false

        //         },
        //         {
        //             id: "3333",
        //             artist: "artist3333",
        //             title: "title44444",
        //             url: "https://biobutterfly.com/wp-content/themes/musicapp/src/music/song6.mp3",
        //             artwork: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/26sz5.jpg",
        //             db_id: 22222,
        //             playlist_id: 2,
        //             down_count: 0,
        //             price: 0,
        //             purchase_status: true, // if user already purchase this song then true, else false
        //             downloading: false

        //         }
        //     ]
        // })

    }

    get_playlist_songs_sqlite = async() => {
        await global.dbManager.getAllPlaylists()
        .then((values) => {
            var playlists = [];
            for(i = 0; i < values.length; i ++) {
                var playlist = {
                    id: values[i].id,
                    name: values[i].title,
                    picture: values[i].pic_path
                }
                playlists.push(playlist);
            }
            this.setState({
                playlists: playlists
            })
        }).catch((error) => {

        })

        await global.dbManager.getAllSongs()
        .then((values) => {
            var items = [];
            for(i = 0; i < values.length; i ++) {
                if(values[i].playlist_id == "0") {
                    var item = {
                        id: values[i].id,
                        artist: values[i].artist,
                        title: values[i].title,
                        url: values[i].url,
                        artwork: values[i].artwork,
                        db_id: values[i].id,
                        playlist_id: values[i].playlist_id,
                        down_count: 0,
                        price: 0,
                        purchase_status: true, // if user already purchase this song then true, else false
                        downloading: false
                    }
                    items.push(item);
                }
            }
            this.setState({
                items: items
            })
        }).catch((error) => {

        })
    }

    add_playlist_modal() {
        // console.log("asdfasdfasdfsadf")
        this.setState({
            show_add_playlist_modal: true
        })
    }

    plcture_selecet_alert() {
        ImagePicker.showImagePicker(options, (response) => {
            const {error, uri, originalRotation} = response;
            if (response.didCancel) {
                console.log('image picker cancelled');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                this.setState({new_playlist_pic_url: response.uri});
                
            }
        });
    }

    create_playlist = async(type) => {
        if(type == 'cancel') {
            this.setState({
                new_playlist_pic_url: '',
                new_playlist_name: '',
                show_add_playlist_modal: false
            })
        } else {
            if(this.state.new_playlist_name == '') {
                Alert.alert("Waves.", "Please input new PlayList name.");
                return;
            }

            var success = true;
            var saved_file_path = '';
            if(this.state.new_playlist_pic_url != "") {
            
                let pic_filename = Date.now()
                const downloadDest_pic = `${RNFS.CachesDirectoryPath}/${global.picture_dir}/${pic_filename}.png`;
            
                const progress = data => {
                    const percentage = ((100 * data.bytesWritten) / data.contentLength) | 0;
                    console.log(`Progress  ${percentage}% `)
                };
            
                const begin = res => {
                
                };
            
                const progressDivider = 1;
                const background = false;

                //////////  download image file  /////////
                let ret_picture = RNFS.downloadFile({ fromUrl: this.state.new_playlist_pic_url, toFile: downloadDest_pic, begin, progress, background, progressDivider });
                await ret_picture.promise.then(res => {
                    saved_file_path = "file://" + downloadDest_pic;
                    console.log(saved_file_path + ":::::::::::::::::::::::::::");
                }).catch(err => {
                    success = false;
                    console.log(err.message)
                });
                await RNFS.readFile(this.state.new_playlist_pic_url, 'base64')
                .then(res =>{
                    this.setState({resBase64:res})
                    let base64 = res
                    RNFS.writeFile("file://" + downloadDest_pic,base64,'base64')
                    .then(() => {
                        console.log("trurururururur")
                    })
                    .catch((error) => {
                        console.log("err",error);
                    });
                });

            } else {
                Alert.alert("Waves", "Please select PlayList picture");
                return;
            }
            
            if(success) {
                //////  add to sqlite  ///
                await global.dbManager.addPlaylistToTable(this.state.new_playlist_name, saved_file_path)
                .then((value) => {
                    console.log(value)
                }).catch((error) => {
                    success = false;
                })
                await global.dbManager.getAllPlaylists()
                .then((value) => {
                    console.log(value)
                }).catch((error) => {
                    success = false;
                })
            }

            this.setState({
                new_playlist_pic_url: '',
                new_playlist_name: '',
                show_add_playlist_modal: false
            })

            ////  get playlist and songs
            this.get_playlist_songs_sqlite();

            if(!success) {
                Alert.alert("Waves", "There an error in creating new PlayList. Please try again.");
            }
        }
    }

    onPress = async item => {
        await TrackPlayer.reset();

        var track_list = Object.assign([], this.state.items);
        await TrackPlayer.add(track_list);
        await TrackPlayer.skip(String(item.id));
        await TrackPlayer.play()
    }

    onPressGoToPlaylist = item => {
        this.props.navigation.navigate('Playlist', {
            playlist: item, prev: "userplaylist"
        })
    }
    onHandleSeeAll = item => {
        if (item === CONSTANT_SEEL_ALL.YOUR_PLAYLISTS){
            this.props.navigation.navigate('Playlists', {
                title: item, prev: "userplaylist"
            })
            // console.log("111111")
        } else if (item === CONSTANT_SEEL_ALL.DOWNLOADED_SONGS) {
            this.props.navigation.navigate('Music', {
                title: item
            })
            // console.log("22222222")
        }
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

    const { items, artists, albums, playlists } = this.state
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
        {
            this.state.show_add_playlist_modal &&
            <View style = {{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', zIndex: 100}}>
                <View style = {{width: '80%', height: 300, backgroundColor: '#303030', borderRadius: 5, marginTop: 100}}>
                    {/* <TouchableOpacity style = {{width: 30, height: 30, position: 'absolute', right: 5, top: 5}} onPress = {() => this.setState({show_add_playlist_modal: false})}>
                        <Image style = {{height: '100%', width: '100%'}} resizeMode = {'contain'} source = {require('../../images/modal_cancel.png')}/>
                    </TouchableOpacity> */}
                    <View style = {{width: '100%', height: '20%', alignItems: 'center', justifyContent: 'center'}}>
                        <Text style = {{color: COLORS.text.white, fontSize: 18, fontFamily: FONTS.type.Medium,}}>{strings.create_playlist}</Text>
                    </View>
                    <View style = {{width: '100%', height: '45%', alignItems: 'center', justifyContent: 'center'}}>
                        <TouchableOpacity style = {{height: '90%', aspectRatio: 1, overflow: 'hidden', borderRadius: 5}} onPress = {() => this.plcture_selecet_alert()}>
                        {
                            this.state.new_playlist_pic_url == '' &&
                            <Image style = {{height: '100%', width: '100%'}} resizeMode = {'contain'} source = {require('../../images/logo.png')}/>
                        }
                        {
                            this.state.new_playlist_pic_url != '' &&
                            <Image style = {{height: '100%', width: '100%'}} resizeMode = {'cover'} source = {{uri: this.state.new_playlist_pic_url}}/>
                        }    
                        </TouchableOpacity>
                    </View>
                    <View style = {{width: '100%', height: '15%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <TextInput style = {{width: '80%', height: 40, fontSize: 15, color: '#ffffff', backgroundColor: '#222222', paddingLeft: 5, borderRadius: 5, fontFamily: FONTS.type.Regular}} 
                            placeholder = {'New PlayList Name'}
                            placeholderTextColor = {'#808080'}
                            onChangeText = {(text) => this.setState({new_playlist_name: text})}>

                        </TextInput>
                    </View>
                    <View style = {{width: '100%', height: '20%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <TouchableOpacity style = {{width: '40%', height: '70%', borderRadius: 5, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', marginRight: 10}} onPress = {() => this.create_playlist("cancel")}>
                            <Text style = {{color: COLORS.text.black, fontSize: 18, fontFamily: FONTS.type.Medium,}}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {{width: '40%', height: '70%', borderRadius: 5, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center'}} onPress = {() => this.create_playlist("ok")}>
                            <Text style = {{color: COLORS.text.black, fontSize: 18, fontFamily: FONTS.type.Medium,}}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        }
        
            <ScrollView scrollEventThrottle={16} >
                <View style={style.container}>
                    <FlatListHeader title={strings.the_user_playlists} seeAll={strings.see_all} onPress={this.onHandleSeeAll}/>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}
                            viewabilityConfig={VIEWABILITY_CONFIG}
                            removeClippedSubviews
                            data={playlists}
                            refFlatlist={(ref) => { this.refFlatlist = ref; }}
                            keyExtractor={(item, index) => item + index || item.id || index.toString()}
                            listKey={(index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <AlbumHorizontalComponent
                                    index={index}
                                    lastIndex={items.length - 1}
                                    item={item}
                                    onPress={this.onPressGoToPlaylist} />
                            )}
                        />
                    </ScrollView>
                </View>
                <View >
                    <View style = {{margin: 15}}>
                        <FlatListHeader title={strings.the_songs} seeAll={strings.see_all} onPress={this.onHandleSeeAll}/>
                    </View>
                    {/* <ScrollView scrollEventThrottle={16} style={STYLES.scrollContainer}> */}
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            viewabilityConfig={VIEWABILITY_CONFIG}
                            
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
                                />
                            )}
                        />
                    {/* </ScrollView> */}
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
export default UserPlaylistContainer