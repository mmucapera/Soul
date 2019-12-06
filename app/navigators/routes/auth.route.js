// import { createStackNavigator } from 'react-navigation'
import {createStackNavigator} from "react-navigation-stack"
import { LoginContainer } from '../../containers/auth/login'
import { COLORS, FONTS } from '../../themes'

const navOptions = {
    headerStyle: {
        backgroundColor: COLORS.text.primary,
        borderBottomWidth: 0,
        borderWidth: 0,
        borderColor: '#979797',
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.1
    },
    headerTintColor: COLORS.text.white,
    headerTitleStyle: {
        fontSize: 18,
        fontFamily: FONTS.type.Regular,
        color: COLORS.text.white,
    }
};

const options = {
    mode: 'card',
    headerMode: 'screen',
    initialRouteName: 'Login',
}

const AuthStack = createStackNavigator({
    Login: {
        screen: LoginContainer,
        navigationOptions: navOptions,
        path: 'login'
    },
}, options)
export default AuthStack