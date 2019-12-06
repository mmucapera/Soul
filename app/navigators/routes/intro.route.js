// import { createStackNavigator } from 'react-navigation'
import {createStackNavigator} from "react-navigation-stack"
import { IntroduceContainer } from '../../containers/auth/intro'
const options = {
    mode: 'none',
    headerMode: 'none',
    initialRouteName: 'Intro',
}
const introStack = createStackNavigator({
    Intro: {
        screen: IntroduceContainer,
        path: 'intro'
    },
}, options)
export default introStack
