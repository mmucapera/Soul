import React, {Fragment, Component} from 'react';
// import { createBottomTabNavigator, createStackNavigator} from 'react-navigation'
import {createStackNavigator} from "react-navigation-stack"
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/Feather'
import { COLORS, FONTS} from '../../themes'
import { RadioStack, LibraryStack, SearchStack, SettingStack, TrendingStack, UserPlayListStack } from './cards'
import { SortModalContainer } from '../../containers/library'
import PlayerContainer from '../../containers/player/PlayerContainer'
import PlaylistListContainer from '../../containers/playlists/PlaylistListContainer'
import MusicContainer from '../../containers/music/MusicContainer'

import SplashContainer from '../../containers/splash'
import LoginContainer from '../../containers/auth/login'
import RegisterContainer from '../../containers/auth/register'
import ForgotPasswordContainer from '../../containers/auth/forgotpassword'


const options = {
    mode: 'card',
    initialRouteName: 'Library'
}
const navOptions = {
    headerStyle: {
        backgroundColor: COLORS.backgroundColor,
        borderBottomWidth: 0,
        borderWidth: 0,
    },
    headerTitleStyle: {
        fontFamily: FONTS.type.Regular,
    }
};

const tabBarOnPress = navigation => {
    if (navigation.isFocused() && navigation.state.index > 0) {
        navigation.popToTop()
    } else {
        const navigationInRoute = navigation.getChildNavigation(
            navigation.state.routes[0].key
        )
        if (!!navigationInRoute &&navigationInRoute.isFocused() && !!navigationInRoute.state.params &&!!navigationInRoute.state.params.scrollToTop) {
            navigationInRoute.state.params.scrollToTop()
        } else {
            navigation.navigate(navigation.state.key)
        }
    }
}
const AppStack = props = createBottomTabNavigator({
        Library: {
            screen: LibraryStack,
            path: 'library',
            navigationOptions: () => ({
                tabBarIcon: ({ tintColor }) => {
                    return (
                        <Icon name="music" size={24} color={tintColor} />
                    )
                }
            }),
            tabBarVisible: false
        },
        Discover: {
            screen: TrendingStack,
            path: 'trending',
            navigationOptions: ({ navigation }) => ({
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="activity" size={24} color={tintColor} />
                ),
                tabBarOnPress: () => tabBarOnPress(navigation)
            }),
            tabBarVisible: false
        },
        // Radio: {
        //     screen: RadioStack,
        //     path: 'radio',
        //     navigationOptions: ({ navigation }) => ({
        //         tabBarIcon: ({ tintColor }) => (
        //             <Icon name="radio" size={24} color={tintColor} />
        //         ),
        //         tabBarOnPress: () => tabBarOnPress(navigation)
        //     }),
        //     tabBarVisible: false
        // },
        PlayList: {
            screen: UserPlayListStack,
            path: 'userplaylist',
            navigationOptions: ({ navigation }) => ({
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="list" size={24} color={tintColor} />
                ),
                tabBarOnPress: () => tabBarOnPress(navigation)
            }),
            tabBarVisible: false
        },
        Search: {
            screen: SearchStack,
            path: 'search',
            navigationOptions: ({ navigation }) => ({
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="search" size={24} color={tintColor} />
                ),
                tabBarOnPress: () => tabBarOnPress(navigation)
            }),
            tabBarVisible: false
        },
        Setting: {
            screen: SettingStack,
            path: 'setting',
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => (
                    <Icon name="settings" size={20}  color={tintColor} />
                )
            },
            tabBarVisible: false
        }
    },{
        tabBarOptions: {
            activeTintColor: COLORS.text.primary,
            inactiveTintColor: COLORS.text.grey,
            labelStyle:{
                fontFamily: FONTS.type.Bold,
                fontSize: 13,
            },
            style: {
                backgroundColor: COLORS.backgroundColor,
                borderTopWidth: 0.1,
                elevation: 10,
                borderColor: COLORS.border.separateLineDark,
                shadowColor: COLORS.text.black,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
            }
        }
    },
    options
)

const AuthStack = createStackNavigator(
    {
        Login: {
            screen: LoginContainer,
            navigationOptions: {
                header: null
            },
            path: 'login',
        },
        Register: {
            screen: RegisterContainer,
            navigationOptions: {
                header: null
            },
            path: 'register',
        },
        ForgotPassword: {
            screen: ForgotPasswordContainer,
            navigationOptions: {
                header: null
            },
            path: 'forgotpassword',
        },
    },
    {
        initialRouteName: 'Login'
    }
)

const RootStackNav = createStackNavigator(
    {
        Splash: {
            screen: SplashContainer,
            navigationOptions: {
                header: null
            },
            path: 'forgotpassword',
        },
        AuthStack: {
            screen: AuthStack,
            navigationOptions: {
                header: null
            }
        },
        AppStack: {
            screen: AppStack,
            navigationOptions: {
                header: null
            }
        },
        SortModal: {
            screen: SortModalContainer,
            navigationOptions: {
                header: null
            },
            path: 'sort_modal',
        },
        Player: {
            screen: PlayerContainer,
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
            path: 'player',
        },
    },{ mode: 'modal' }
)
export default RootStackNav

// function getActiveRouteName(navigationState) {
// 	if (!navigationState) {
// 		return null;
// 	}
// 	const route = navigationState.routes[navigationState.index];
// 	// dive into nested navigators
// 	// console.warn(route);
// 	if (route.routes) {
// 		return getActiveRouteName(route);
// 	}
//   	return route.routeName;
// }

// export default class RootStack extends Component {

//     constructor(props) {
//         super(props);

//     }

//     componentDidMount() {
//         this.backButtonListener = BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        
//     };

//     handleBackButton = () => {
// 		Alert.alert('Notice!', 'Do you really want to exit?',
// 			[
// 				{text: 'Cancel', onPress: null},
// 				{text: 'Ok', onPress: () => BackHandler.exitApp()}
// 			],
// 			{ cancelable: true }
// 		);
// 		return true;
		
//     };

//     render() {
//         return(
//             <RootStack
//                 onNavigationStateChange={(prevState, currentState) => {
//                     const currentScreen = getActiveRouteName(currentState);
// 					if(currentScreen == 'Login' || currentScreen == 'LibraryStack') {
//                         this.backButtonListener = BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
                        
//                     } else {
//                         this.backButtonListener.remove();
//                     }
//                     // console.warn(currentScreen);
//                 }}
//             />
//         )
//     }
// }


