/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment, Component} from 'react';
import {
  YellowBox,
  BackHandler,
    Alert
} from 'react-native';

import RootContainer from './app/containers';

YellowBox.ignoreWarnings(["Warning:"]);
YellowBox.ignoreWarnings(["`-[RCTRootView cancelTouches]`"]);
YellowBox.ignoreWarnings(["VirtualizedLists"]);
YellowBox.ignoreWarnings(["RCTUIManager"]);

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

// export default class App extends Component {

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
//             <RootContainer
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

export default class App extends React.Component {
    render() {
        return (<RootContainer />);
    }
}



// const styles = StyleSheet.create({

// });

// export default App;
