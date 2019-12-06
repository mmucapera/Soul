import { COLORS, FONTS } from '../../themes';

const styles = {
    container: {
        flex: 1,
        height: 65,
        marginBottom: 5,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionTitle: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
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

}

export default styles
