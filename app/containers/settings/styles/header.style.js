import { METRICS, COLORS, FONTS } from '../../../themes';
const styles = {
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundGreyColor,
        height: 120,
        paddingLeft: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
        marginTop: 15
    },
    wrapper:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    picture:{
        width: 80,
        height: 80,
        borderRadius: 80/2,
        marginRight: 10,
        backgroundColor: COLORS.emptyColor
    },
    name: {
        color: COLORS.text.white,
        fontSize: 18,
        fontFamily: FONTS.type.Medium,
    },
    subLabel:{
        color: COLORS.text.grey,
        fontSize: 14,
        fontFamily: FONTS.type.Regular,
    },
    icon: {
        alignSelf: 'center',
        color: '#878787',
        alignItems: 'center',
        fontSize: 16,
        paddingRight: 10
    },

};
export default styles;
