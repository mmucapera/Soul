
// import {
//     createStackNavigator
// } from 'react-navigation';
import {createStackNavigator} from "react-navigation-stack"
import { UserPlayListContainer } from '../../../containers/user-playlist'
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
const options = {
    mode: 'modal',
    headerMode: 'screen',
    initialRouteName: 'UserPlayList',
}
const UserPlayListStack = createStackNavigator({
    UserPlayList: {
        screen: UserPlayListContainer,
        navigationOptions: navOptions,
        path: 'userplaylist',
    },
    Playlist: {
        screen: PlaylistContainer,
        navigationOptions: navOptions,
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
    
}, options);

export default UserPlayListStack;