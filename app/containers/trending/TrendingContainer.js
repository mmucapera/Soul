import React, {Component} from 'react';
import { View, Text, SafeAreaView, ScrollView, FlatList, Alert} from 'react-native';
import _ from "lodash";
import strings from '../../localization/strings';
import { TrendingMusicHorizontalComponent } from '../../components/music';
import { ArtistHorizontalComponent} from '../../components/artists';
import { AlbumHorizontalComponent } from '../../components/albums';
import { PlaylistHorizontalComponent } from '../../components/playlist';
import { FlatListHeader } from '../../components/header';
import { MinPlayerComponent } from '../../components/player';
import { CONSTANT_SEEL_ALL } from '../../utils/constant'
import { STYLES } from '../../themes'
import style from './styles'
import TrackPlayer, {STATE_PLAYING, STATE_PAUSED, STATE_BUFFERING, STATE_NONE, STATE_READY, STATE_STOPPED} from 'react-native-track-player';
import global from '../../global/global';
import { purchase_song } from '../../global/global_func';
import { SkypeIndicator } from 'react-native-indicators';

const RNFS = require('react-native-fs');

const VIEWABILITY_CONFIG = {
  minimumViewTime: 3000,
  viewAreaCoveragePercentThreshold: 95,
  waitForInteraction: true,
};


class TrendingContainer extends Component {

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
            playlists:[]
        };
    }
    
    UNSAFE_componentWillMount() {
    
    }

    static navigationOptions = ({ }) => {
        return {
            headerLeft: (<View style={STYLES.headerContainer}>
            <Text style={[STYLES.headerContainer.title]}>{strings.discover}</Text>
            </View>)
        };
    }

    componentDidMount() { 
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

        this.setState({showIndicator: true});
        await fetch(global.server_url + '/api/discover', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': global.token
            }
        })
        .then(response => response.json())
        .then(async data => {
            console.log(data.data.trending)
            const error_code = data.error.code;
            if(error_code == 401) {
                Alert.alert("Waves!", 'Token error!');
            } else if(error_code == 402) {
                Alert.alert("Waves!", 'Your account is disabled!');
            } else if(error_code == 200) {
                
                var items = [];
                var trending = [];
                var artists = [];
                var albums = [];
                var playlists = [];
                
                for(i = 0; i < data.data.trending.length; i ++) {
                    var artist_name = "";
                    if(data.data.trending[i].artist_name == null) {
                        artist_name = "No Artist";
                    } else {
                        artist_name = data.data.trending[i].artist_name;
                    }
                    var album_id = 0;
                    if(data.data.trending[i].album_id != null) {
                        album_id = data.data.trending[i].album_id;
                    }
                    var artist_id = 0;
                    if(data.data.trending[i].artist_id != null) {
                        artist_id = data.data.trending[i].artist_id;
                    }
                    var playlist_id = 0;
                    if(data.data.trending[i].playlist_id != null) {
                        playlist_id = data.data.trending[i].playlist_id;
                    }
                    var purchase_status = true;
                    if(data.data.trending[i].price != 0) {
                        if(data.data.trending[i].user_trans != null) {
                            purchase_status = false;
                        }
                    }

                    trending.push({
                        id: data.data.trending[i].id,
                        artist: artist_name,
                        title: data.data.trending[i].name,
                        url: global.server_url + data.data.trending[i].audio,
                        artwork: global.server_url + data.data.trending[i].img,
                        db_id: data.data.trending[i].id,
                        down_count: data.data.trending[i].downCount,
                        price: data.data.trending[i].price,
                        downloading: false,
                        album_id: album_id,
                        artist_id: artist_id,
                        playlist_id: playlist_id,
                        purchase_status: purchase_status, // if user already purchase this song then true, else false
                        
                    });
                }
                for(i = 0; i < data.data.artists.length; i ++) {
                    artists.push({
                        id: data.data.artists[i].id,
                        name: data.data.artists[i].name,
                        picture: global.server_url + data.data.artists[i].img,
                    });
                }
                for(i = 0; i < data.data.playlist.length; i ++) {
                    playlists.push({
                        id: data.data.playlist[i].id,
                        name: data.data.playlist[i].name,
                        picture: global.server_url + data.data.playlist[i].img,
                    });
                }
                for(i = 0; i < data.data.albums.length; i ++) {
                    albums.push({
                        id: data.data.albums[i].id,
                        name: data.data.albums[i].name,
                        picture: global.server_url + data.data.albums[i].img,
                    });
                }

                var items = Object.assign([], trending);
                let arrayItems = [], size = 3;
                while (items.length > 0){
                    arrayItems.push(items.splice(0, size));
                }

                this.setState({
                    items: arrayItems,
                    trending: trending,
                    artists: artists,
                    playlists: playlists,
                    albums: albums
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

    onPressSong = async item => {

        // await TrackPlayer.add(track_list);
        ////  if this song is un-free, then return

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
        var track_list = Object.assign([], this.state.trending);
        for(i = 0; i < track_list.length; i ++) {
            if(!track_list[i].purchase_status) {
                track_list.splice(i, 1);
            }
        }
        await TrackPlayer.add(track_list);
        for(i = 0; i < track_list.length; i ++) {
            if(item.id == track_list[i].id) {
                await TrackPlayer.skip(String(track_list[i].id));
                break;
            }
        }
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

        var items = Object.assign([], this.state.trending);
        for(index = 0; index < items.length; index ++) {
            if(items[index].id == track_item.id) {
                items[index].downloading = true;
            }
        }
        var arrayItems = [], size = 3;
        while (items.length > 0){
            arrayItems.push(items.splice(0, size));
        }
        this.setState({ items: arrayItems })
    
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

        items = Object.assign([], this.state.trending);
        for(index = 0; index < items.length; index ++) {
            if(items[index].id == track_item.id) {
                items[index].downloading = false;
            }
        }
        arrayItems = [], size = 3;
        while (items.length > 0){
            arrayItems.push(items.splice(0, size));
        }
        this.setState({ items: arrayItems })

        ///////  add song to sqlite  ////////
        global.dbManager.addSongToTable(track_item.title, track_item.artist, downloadDest_audio, downloadDest_pic, track_item.db_id)
        .then((value) => {
            console.log("add song to sql is successed")
        }).catch((error) => {
            console.log("add song to sql is failed")
        })
    }

    onPressGoToArtist = item => {
        console.log("item==", item)
        this.props.navigation.navigate('Artist', {
            artist: item
        })
    }
    onPressGoToAlbum = item => {
        this.props.navigation.navigate('Album', {
            album: item
        })
    }
    onPressGoToPlaylist = item => {
        this.props.navigation.navigate('Playlist', {
            playlist: item
        })
    }
    onHandleSeeAll = item => {
        if (item === CONSTANT_SEEL_ALL.TRENDING){
            this.props.navigation.navigate('Music', {
                title: item
            })
        } else if (item === CONSTANT_SEEL_ALL.TOP_ARTISTS){
            this.props.navigation.navigate('Artists', {
                title: item
            })
        } else if (item === CONSTANT_SEEL_ALL.THE_BEST_PLAYLISTS) {
            this.props.navigation.navigate('Playlists', {
                title: item
            })
        }else {
            this.props.navigation.navigate('Albums', {
                title: item
            })
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
        <ScrollView scrollEventThrottle={16} >
          <View style={style.container}>
            <FlatListHeader title={strings.trending} seeAll={strings.see_all} onPress={this.onHandleSeeAll} />

            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                viewabilityConfig={VIEWABILITY_CONFIG}
                removeClippedSubviews
                data={items}
                refFlatlist={(ref) => { this.refFlatlist = ref; }}
                keyExtractor={(item, index) => item + index || item.id || index.toString()}
                listKey={(index) => index.toString()}
                renderItem={({ item, index }) => (
                  <TrendingMusicHorizontalComponent
                    index={index}
                    lastIndex={items.length - 1}
                    item={item}
                    onPress={this.onPressSong}
                    onPressDownload = {this.onPressDownload}
                  />
                )}
              />
            </ScrollView>
          </View>

            <View style={style.container}>
            <FlatListHeader title={strings.top_artists} seeAll={strings.see_all} onPress={this.onHandleSeeAll}/>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
               <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                viewabilityConfig={VIEWABILITY_CONFIG}
                removeClippedSubviews
                data={artists}
                refFlatlist={(ref) => { this.refFlatlist = ref; }}
                keyExtractor={(item, index) => item + index || item.id || index.toString()}
                listKey={(index) => index.toString()}
                renderItem={({ item, index }) => (
                  <ArtistHorizontalComponent 
                    index={index}
                    lastIndex={items.length - 1}
                    item={item}
                    onPress={this.onPressGoToArtist}/>
                )}
              />
            </ScrollView>
          
          </View>
          <View style={style.container}>
            <FlatListHeader title={strings.the_best_playlists} seeAll={strings.see_all} onPress={this.onHandleSeeAll}/>
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

          <View style={[style.container,STYLES.scrollContainer]}>
            <FlatListHeader title={strings.popular_albums} seeAll={strings.see_all} onPress={this.onHandleSeeAll}/>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                viewabilityConfig={VIEWABILITY_CONFIG}
                removeClippedSubviews
                data={albums}
                refFlatlist={(ref) => { this.refFlatlist = ref; }}
                keyExtractor={(item, index) => item + index || item.id || index.toString()}
                listKey={(index) => index.toString()}
                renderItem={({ item, index }) => (
                  <PlaylistHorizontalComponent
                    index={index}
                    lastIndex={items.length - 1}
                    item={item}
                    onPress={this.onPressGoToAlbum} />
                )}
              />
            </ScrollView>
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
export default TrendingContainer