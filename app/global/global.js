import TrackPlayer, {STATE_PLAYING} from 'react-native-track-player';
import SQLite from 'react-native-sqlite-storage'
import { BaseManager } from '../database'

export default {
    server_url: 'http://188.93.231.15:3005',
    email: '',
    password: '',
    display_name: '',
    country: '',
    phone_number: '',
    gender: '',
    birthday: '',
    avatar_url: '',
    token: '',

    credit_status: false,
    card_number: '',
    credit_expiry: '',
    credit_cvc: '',

    music_play_style: "", //play or shuffle  is used for discover/Trending see all
    artist_music_play_style: "", //play or shuffle  is used for discover/Top artist 

    dbManager: null,
    audio_dir: 'ww/audio',
    picture_dir: 'ww/picture',
}