import { Dimensions, Platform} from 'react-native';
const { width, height } = Dimensions.get('window');
const metrics = {
    headerHeight: 55,
    marginHorizontal: 10,
    marginVertical: 10,
    section: 25,
    baseMargin: 10,
    halfBaseMargin: 15,
    doubleBaseMargin: 20,
    smallMargin: 5,
    largeMargin: 30,
    horizontalLineHeight: 1,
    searchBarHeight: 30,
    screenWidth: width < height ? width : height,
    screenHeight: width < height ? height : width,
    navBarHeight: (Platform.OS === 'ios') ? 64 : 54,
    buttonRadius: 4,
    content: {
        tiny: 5,
        small: 10,
        medium: 20,
        large: 30,
        xl: 40,
    },
    space: {
        marginXL: {
            margin: 50,
        },
    },
    icons: {
        tiny: 15,
        small: 20,
        medium: 30,
        large: 45,
        xl: 60,
    },
    images: {
        small: 20,
        medium: 40,
        large: 60,
        logo: 300,
    },

    imageSizeSM: {
        height: 30,
        width: 30,
    },
    imageSizeXS: {
        height: 20,
        width: 20,
    },
};

export default metrics;
