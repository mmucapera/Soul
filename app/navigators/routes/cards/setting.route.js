// import { createStackNavigator } from 'react-navigation';
import {createStackNavigator} from "react-navigation-stack"
import { SettingsContainer, MyAccountContainer,MyPasswordContainer,MPesaContainer,TopUpContainer,AboutUsContainer,PrivacyPolicyContainer,CreditCardContainer

} from '../../../containers/settings'
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
    },MPesa: {
        screen: MPesaContainer , 
        navigationOptions: navOptions,
        path: 'mpesa',
    },TopUp: {
        screen: TopUpContainer ,
        navigationOptions: navOptions,
        path: 'topup',
    },AboutUs : {
        screen: AboutUsContainer ,
        navigationOptions: navOptions,
        path: 'aboutus',
    },PrivacyPolicy : {
        screen: PrivacyPolicyContainer ,
        navigationOptions: navOptions,
        path: 'aboutus',
    },CreditCard : {
        screen: CreditCardContainer ,
        navigationOptions: navOptions,
        path: 'creditcard',
    },MyPassword : {
        screen: MyPasswordContainer ,
        navigationOptions: navOptions,
        path: 'mypassword',
    }



    //PrivacyPolicyContainer
});

export default SettingStack;