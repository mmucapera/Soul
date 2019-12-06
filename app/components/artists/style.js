import { COLORS, FONTS } from '../../themes';
const styles = {
    container: {
        flex: 1,
        marginBottom: 0,
        alignItems: "center",
        marginRight: 10,
        marginBottom: 8
    },
    picture: {
        borderRadius: 15,
        width: 125,
        height: 125,
        backgroundColor: COLORS.emptyColor,
    },
    name: {
        color: COLORS.text.primary,
        fontSize: 18,
        fontFamily: FONTS.type.Medium,
        textAlign: "center",
        marginTop: 10
    }

};
export default styles;

