import { Dimensions } from 'react-native';
const width = Dimensions.get('window').width;
import { COLORS, FONTS } from '../../../themes';

const styles = {
    flatListContainer: {
        marginTop: 15
    },
    imageBackground: {
        backgroundColor: COLORS.emptyColor,
        width: width,
        height: 400,
        opacity: 0.5
    },
    parallaxHeader: {
        flex: 1,
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        marginTop: 100,
        width: 160,
        height: 160,
        borderRadius: 160 / 2,
        backgroundColor: COLORS.emptyColor,
        marginBottom: 8,
        borderColor: COLORS.text.grey,
        borderWidth: 8,
    },
    avatarContainer: {
        shadowColor: COLORS.text.primary,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.50,
        shadowRadius: 30,
        elevation: 40,
    },
    name: {
        color: COLORS.text.white,
        fontSize: 20,
        fontFamily: FONTS.type.Bold,
        textAlign: "center",
        marginBottom: 8
    },
}

export default styles
