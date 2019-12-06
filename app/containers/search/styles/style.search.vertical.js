import { COLORS, FONTS } from '../../../themes';
import { Dimensions } from 'react-native'
const width = Dimensions.get('window').width
const styles = {
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundGreyColor,
        height: 70,
        margin: 15,
        marginTop: 8,
        marginBottom: 8,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10
    },
    actionTitle: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'center',
    },
    actionIcon: {
        alignItems: 'stretch',
        justifyContent: 'center',
        iconDotDot: {
            marginRight: 10,
            color: COLORS.text.white,
        },
    },
    picture: {
        borderRadius: 15,
        width: 55,
        height: 55,
        backgroundColor: COLORS.emptyColor,

    },
    title: {
        color: COLORS.text.white,
        fontSize: 15,
        fontFamily: FONTS.type.Medium,
    },
    name: {
        color: COLORS.text.primary,
        fontSize: 15,
        fontFamily: FONTS.type.Medium,
    }

};
export default styles;

