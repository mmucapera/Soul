
// import { createStackNavigator } from 'react-navigation';
import {createStackNavigator} from "react-navigation-stack"
import { BrowseContainer } from '../../../containers/browse'
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
const BrowseStack = createStackNavigator({
    Browse: {
        screen: BrowseContainer,
        navigationOptions: navOptions,
        path: 'browse',
    },
});

export default BrowseStack;