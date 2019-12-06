
// import { createStackNavigator } from 'react-navigation';
import {createStackNavigator} from "react-navigation-stack"
import { TrendingContainer } from '../../../containers/trending'
import { ArtistContainer, ArtistListContainer } from '../../../containers/artists'
import { AlbumContainer, AlbumListContainer } from '../../../containers/albums'
import { PlaylistContainer, PlaylistListContainer } from '../../../containers/playlists'
import { MusicContainer } from '../../../containers/music'

import { COLORS, FONTS } from '../../../themes'
const navOptions = {
    headerStyle: {
        backgroundColor: COLORS.backgroundColor,
        borderBottomWidth: 0,
        borderWidth: 0,
    },
    headerTintColor: COLORS.text.white,
    headerTitleStyle: {
        fontFamily: FONTS.type.Regular,
    }
};
const TrendingStack = createStackNavigator({
    Trending: {
        screen: TrendingContainer,
        navigationOptions: navOptions,
        path: 'timeline',
    },
    Artist: {
        screen: ArtistContainer,
        navigationOptions: {
            headerStyle: {
                backgroundColor: 'transparent',
                borderBottomWidth: 0,
                borderWidth: 0,
            },
            headerTintColor: COLORS.text.white,
            headerTitleStyle: {
                fontFamily: FONTS.type.Regular,
            }
        },
        path: 'artist',
    },
    Artists: {
        screen: ArtistListContainer,
        navigationOptions: navOptions,
        path: 'artists',
    },
    Album: {
        screen: AlbumContainer,
        navigationOptions: {
            headerStyle: {
                backgroundColor: 'transparent',
                borderBottomWidth: 0,
                borderWidth: 0,
            },
            headerTintColor: COLORS.text.white,
            headerTitleStyle: {
                fontFamily: FONTS.type.Regular,
            }
        },
        path: 'album',
    },
    Albums: {
        screen: AlbumListContainer,
        navigationOptions: navOptions,
        path: 'albums',
    },
    Playlist: {
        screen: PlaylistContainer,
        navigationOptions: {
            headerStyle: {
                backgroundColor: 'transparent',
                borderBottomWidth: 0,
                borderWidth: 0,
            },
            headerTintColor: COLORS.text.white,
            headerTitleStyle: {
                fontFamily: FONTS.type.Regular,
            }
        },
        path: 'playlist',
    },
    Playlists: {
        screen: PlaylistListContainer,
        navigationOptions: navOptions,
        path: 'playlists',
    },
    Music: {
        screen: MusicContainer,
        navigationOptions: navOptions,
        path: 'Music',
    }
});
export default TrendingStack;