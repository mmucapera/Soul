// import { createStackNavigator } from 'react-navigation';
import {createStackNavigator} from "react-navigation-stack"
import { RadioContainer } from '../../../containers/radio'
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
const RadioStack = createStackNavigator({
    Radio: {
        screen: RadioContainer,
        navigationOptions: navOptions,
        path: 'radio',
    }
});

export default RadioStack;