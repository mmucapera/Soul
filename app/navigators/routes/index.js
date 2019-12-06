import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import AppStack from './app.route';
// import AuthStack from './auth.route';
// import IntroStack from './intro.route';
// import { SplashContainer } from '../../containers/splash';

export default createAppContainer(createSwitchNavigator(
    {
        // AuthLoading: SplashContainer,
        App: AppStack,
        // Intro: IntroStack,
        // Auth: AuthStack,
    },
    {
        initialRouteName: 'App'
    },
));
