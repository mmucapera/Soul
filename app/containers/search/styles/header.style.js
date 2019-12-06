import { COLORS, FONTS } from '../../../themes';
const styles = {
    container: {
        flex: 1,
        flexDirection: 'row',
        margin: 15,
        alignItems: "center",
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 18,
        fontFamily: FONTS.type.Bold,
        color: COLORS.text.white,
    },
    button: {
        color: COLORS.text.white,
        fontSize: 12,
        fontFamily: FONTS.type.Medium,
    },
    seeAll: {
        backgroundColor: "rgba(255, 255, 255, 0.11)",
        borderRadius: 10,
        padding: 5
    },
    ListHeaderComponent: {
        margin: 0,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: -10,
        flexDirection: 'row',
    },
    separateLine: {
        flex: 1,
        borderBottomColor: COLORS.backgroundGreyColor,
        borderBottomWidth: 3,
        margin: 15,
    }

};
export default styles;

