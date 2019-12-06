import React, {Component} from 'react';
import { View, Text, SafeAreaView, ScrollView, SectionList, Alert} from 'react-native';
import { SearchBar } from 'react-native-elements';
import SegmentedControlTab from "react-native-segmented-control-tab";
import { MinPlayerComponent } from '../../components/player';
import SearchVerticalComponent from './search.vertical';
import { CONSTANT_SEEL_ALL } from '../../utils/constant'

import strings from '../../localization/strings';
import { STYLES, COLORS, FONTS } from '../../themes'
import styles from './styles'
import HeaderComponent from './header'

import TrackPlayer, {STATE_PLAYING, STATE_PAUSED, STATE_BUFFERING, STATE_NONE, STATE_READY, STATE_STOPPED} from 'react-native-track-player';
import global from '../../global/global';
import { SkypeIndicator } from 'react-native-indicators';


class SearchContainer extends Component {

    static navigationOptions = ({ }) => {
      return {
        headerLeft: (<View style={STYLES.headerContainer}><Text style={STYLES.headerContainer.title}>{strings.search}</Text></View>)
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

          selectedIndex: 0,
          items:[
            // // {
            // //   index: 0,
            // //   title: "Top Results",
            // //   data:[
            // //     {
            // //       title: "Soft Life 001",
            // //       name: "Jodie",
            // //       url: "https://biobutterfly.com/wp-content/themes/musicapp/src/music/song7.mp3",
            // //       picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/22sz5.jpg"
            // //     },
            // //     {
            // //       title: "A Fantasy Trip 003",
            // //       name: "Kandi Landi",
            // //       url: "https://biobutterfly.com/wp-content/themes/musicapp/src/music/song6.mp3",
            // //       picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/26sz5.jpg"
            // //     },
            // //     {
            // //       title: "Soft Life 004",
            // //       name: "Jodie",
            // //       url: "https://biobutterfly.com/wp-content/themes/musicapp/src/music/song7.mp3",
            // //       picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/22sz5.jpg"
            // //     },
            // //   ]
            // // },
            // {
            //   index: 1,
            //   title:"Songs",
            //   data: [
            //     {
            //       title: "Soft Life 001",
            //       name: "Jodie",
            //       url: "https://biobutterfly.com/wp-content/themes/musicapp/src/music/song7.mp3",
            //       picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/22sz5.jpg"
            //     },
            //     {
            //       title: "Happy Accidents 002",
            //       name: "Beatrice",
            //       url: "https://biobutterfly.com/wp-content/themes/musicapp/src/music/song4.mp3",
            //       picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/24sz5.jpg"
            //     },
            //     {
            //       title: "A Fantasy Trip 003",
            //       name: "Kandi Landi",
            //       url: "https://biobutterfly.com/wp-content/themes/musicapp/src/music/song6.mp3",
            //       picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/26sz5.jpg"
            //     }]
            // },
            // {
            //   index: 2,
            //   title:"Artists",
            //   data: [{
            //     name: "Breathe",
            //     picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/125sz5.jpg"
            //   },
            //   {
            //     name: "Stay as you are",
            //     picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/126sz5.jpg"
            //   },
            //   {
            //     name: "Shooting Star",
            //     picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/127sz5.jpg"
            //   },]
            // },
            // {
            //   index: 3,
            //   title: "Albums",
            //   data: [{
            //     title: "Streams",
            //     name: "Breathe",
            //     picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/125sz5.jpg"
            //   },
            //   {
            //     name: "Stay as you are",
            //     title: "Don't Recall",
            //     picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/126sz5.jpg"
            //   },
            //   {
            //     name: "Shooting Star",
            //     title: "Man of Dust",
            //     picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/127sz5.jpg"
            //   },]
            // },{
            //   index: 4,
            //   title: "Playlists",
            //   data: [{
            //     title: "Streams",
            //     name: "Breathe",
            //     picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/125sz5.jpg"
            //   },
            //   {
            //     name: "Stay as you are",
            //     title: "Don't Recall",
            //     picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/126sz5.jpg"
            //   },
            //   {
            //     name: "Shooting Star",
            //     title: "Man of Dust",
            //     picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/127sz5.jpg"
            //   }]
            // }
            ],
          search: '',
      };
    }

    async UNSAFE_componentWillMount() {
        this.setState({showIndicator: true});
        await this.get_search_result("all__data");
        this.setState({showIndicator: false});
    }

    get_search_result = async(search_word) => {
        
        await fetch(global.server_url + '/api/search/' + search_word, {
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
                var songs = [];
                var artists = [];
                var albums = [];
                var playlists = [];
                
                for(i = 0; i < data.data.songs.length; i ++) {
                    var artist_name = "";
                    if(data.data.songs[i].artist_name == null) {
                        artist_name = "No Artist";
                    } else {
                        artist_name = data.data.songs[i].artist_name;
                    }
                    var album_id = 0;
                    if(data.data.songs[i].album_id != null) {
                        album_id = data.data.songs[i].album_id;
                    }
                    var artist_id = 0;
                    if(data.data.songs[i].artist_id != null) {
                        artist_id = data.data.songs[i].artist_id;
                    }
                    var playlist_id = 0;
                    if(data.data.songs[i].playlist_id != null) {
                        playlist_id = data.data.songs[i].playlist_id;
                    }
                    var purchase_status = true;
                    if(data.data.songs[i].price != 0) {
                        if(data.data.songs[i].user_trans != null) {
                            purchase_status = false;
                        }
                    }
                    songs.push({
                        id: data.data.songs[i].id,
                        artist: artist_name,
                        title: data.data.songs[i].name,
                        url: global.server_url + data.data.songs[i].audio,
                        artwork: global.server_url + data.data.songs[i].img,
                        db_id: data.data.songs[i].id,
                        category: "song",
                        down_count: data.data.songs[i].downCount,
                        price: data.data.songs[i].price,
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
                        title: data.data.artists[i].name,
                        artwork: global.server_url + data.data.artists[i].img,
                        category: "artist"
                    });
                }

                for(i = 0; i < data.data.albums.length; i ++) {
                    albums.push({
                        id: data.data.albums[i].id,
                        title: data.data.albums[i].name,
                        artwork: global.server_url + data.data.albums[i].img,
                        category: "album"
                    });
                }

                for(i = 0; i < data.data.playlist.length; i ++) {
                    playlists.push({
                        id: data.data.playlist[i].id,
                        title: data.data.playlist[i].name,
                        artwork: global.server_url + data.data.playlist[i].img,
                        category: "playlist"
                    });
                }
                    
                this.setState({
                    items: [
                        {
                            index: 0,
                            title:"Songs",
                            data: songs
                        },
                        {
                            index: 1,
                            title:"Artists",
                            data: artists
                        },
                        {
                            index: 2,
                            title:"Albums",
                            data: albums
                        },
                        {
                            index: 3,
                            title:"Playlists",
                            data: playlists
                        },
                    ]
                })
    
            } else {
                Alert.alert("Waves!", 'There is an error in server, Please try again.');
            }
        })
        .catch(function(error) {
            Alert.alert('Waves!', error.message);
        });
        
        
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

    updateSearch = search => {
       this.setState({ search });
       if(search == "") {
            this.get_search_result("all__data");
       } else {
            this.get_search_result(search);
       }
    };
    handleIndexChange = index => {
        this.setState({
            ...this.state,
            selectedIndex: index
        });
    };

    onPress = async item =>{
        if(item.category == "song") {
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
            var track_list = Object.assign([], this.state.items[0].data);
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
            await TrackPlayer.skip(String(item.id));
            await TrackPlayer.play()
        } else if(item.category == "artist") {
            this.props.navigation.navigate('Artist', {
                artist: {
                    id: item.id,
                    name: item.title,
                    picture: item.artwork
                }
            })
        } else if(item.category == "album") {
            this.props.navigation.navigate('Album', {
                album: {
                    id: item.id,
                    name: item.title,
                    picture: item.artwork
                }
            })
        } else if(item.category == "playlist") {
            this.props.navigation.navigate('Playlist', {
                playlist: {
                    id: item.id,
                    name: item.title,
                    picture: item.artwork
                }
            })
        }
    }
    
    onHandleSeeAll = item => {
        if (item === CONSTANT_SEEL_ALL.SONGS) {
            this.props.navigation.navigate('Music', {
                title: item
            })
        } else if (item === CONSTANT_SEEL_ALL.ARTISTS) {
            this.props.navigation.navigate('Artists', {
                title: item
            })
        } else if (item === CONSTANT_SEEL_ALL.PLAYLISTS) {
            this.props.navigation.navigate('Playlists', {
                title: item
            })
        } else {
            this.props.navigation.navigate('Albums', {
                title: item
            })
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
      const { search, items, selectedIndex } = this.state;
      return (
        <SafeAreaView style={STYLES.container}>
        {
            this.state.showIndicator &&
            <View style = {{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black', zIndex: 100}}>
                <View style = {{flex: 1}}>
                    <SkypeIndicator color = '#ffffff' />
                </View>
            </View>
        }
          <ScrollView scrollEventThrottle={16}>
            <SectionList
              style={STYLES.scrollContainer}
              ListHeaderComponent={
                <View style={{ marginBottom: 15,  }}>
                  <SearchBar
                    round={true}
                    lightTheme={false}
                    containerStyle={{ backgroundColor: COLORS.backgroundColor, marginLeft: 5, marginRight: 5}}
                    placeholder="Search"
                    onChangeText={this.updateSearch}
                    value={search}
                  />
                  {/* <SegmentedControlTab
                    tabsContainerStyle={styles.tabsContainerStyle}
                    tabStyle={styles.tabStyle}
                    firstTabStyle={styles.firstTabStyle}
                    lastTabStyle={styles.lastTabStyle}
                    tabTextStyle={styles.tabTextStyle}
                    activeTabStyle={styles.activeTabStyle}
                    activeTabTextStyle={styles.activeTabTextStyle}
                    allowFontScaling={true}
                    values={[strings.samneang_music, strings.you_library]}
                    selectedIndex={selectedIndex}
                    onTabPress={this.handleIndexChange}
                  /> */}
                </View>
              }
              renderSectionHeader={({ section: { title, index} }) => (
                <HeaderComponent title={title} index={index} seeAll={strings.see_all} onPress={this.onHandleSeeAll}/>
              )}
              renderItem={({ item, index }) =>
                <SearchVerticalComponent
                  index={index}
                  lastIndex={items.length - 1}
                  item={item}
                  onPress={() => this.onPress(item)}
                />
              }
              sections={items}
              keyExtractor={(item, index) => item + index}
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
export default SearchContainer