import { COLORS, FONTS } from '../../../../themes';

const styles = {
    button: {
        backgroundColor: COLORS.text.primary,
        borderRadius: 10,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonTitle: {
        color: COLORS.text.white,
        fontSize: 16,
        fontFamily: FONTS.type.Regular,
        textAlign: "center",
        marginRight: 5
    },
    buttonIcon:{
        justifyContent: 'center',
        alignItems: 'center',
        color: COLORS.text.white,
    }
}

export default styles
