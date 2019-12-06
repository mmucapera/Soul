
// import {
//     createStackNavigator
// } from 'react-navigation';
import {createStackNavigator} from "react-navigation-stack"
import { LibraryContainer } from '../../../containers/library'

import { COLORS, FONTS } from '../../../themes'

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
const options = {
    mode: 'modal',
    headerMode: 'screen',
    initialRouteName: 'Library',
}
const LibraryStack = createStackNavigator({
    Library: {
        screen: LibraryContainer,
        navigationOptions: navOptions,
        path: 'library',
    },
    
}, options);

export default LibraryStack;