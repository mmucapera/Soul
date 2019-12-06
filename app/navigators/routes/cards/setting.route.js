// import { createStackNavigator } from 'react-navigation';
import {createStackNavigator} from "react-navigation-stack"
import { SettingsContainer, MyAccountContainer, PaymentContainer } from '../../../containers/settings'
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
const SettingStack = createStackNavigator({
    Setting: {
        screen: SettingsContainer ,
        navigationOptions: navOptions,
        path: 'setting',
    },
    MyAccount: {
        screen: MyAccountContainer ,
        navigationOptions: navOptions,
        path: 'myaccount',
    },
    Payment: {
        screen: PaymentContainer ,
        navigationOptions: navOptions,
        path: 'payment',
    },
});

export default SettingStack;