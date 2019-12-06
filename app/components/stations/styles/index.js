import { COLORS, FONTS } from '../../../themes';

const styles = {
    container: {
        flex: 1,
        marginBottom: 0,
        alignItems: "center",
        marginRight: 15
    },
    picture: {
        borderRadius: 15,
        width: 290,
        height: 146,
        backgroundColor: COLORS.emptyColor
    },
    name: {
        marginTop: 5,
        color: COLORS.text.white,
        fontSize: 20,
        fontFamily: FONTS.type.Bold,
        textAlign: 'center'
    },

};
export default styles;

