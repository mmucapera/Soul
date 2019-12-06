import {
    AsyncStorage,
    Platform,
    Alert,
    ActionSheetIOS,
    CameraRoll,
} from 'react-native';

class HelperCls {

    constructor() {
    }
    isAndroid() {
        return Platform.OS === 'android';
    }
    isIOS() {
        return Platform.OS === 'ios';
    }
    validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; /*  eslint-disable-line */
        return re.test(email);
    }
    validateUsername = (username) =>{
        const re = /^[a-z]+(?:_+[a-z]+)*$/
        return re.test(username);
    }

}
const Helper = new HelperCls();
export { Helper };
