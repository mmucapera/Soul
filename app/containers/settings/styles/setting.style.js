import { METRICS, COLORS, FONTS } from '../../../themes';
const styles = {
    wrapper:{
        flex: 1,
        backgroundColor: COLORS.backgroundGreyColor,
        height: 45,
        paddingLeft: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    title:{
        color: COLORS.text.white,
        fontSize: 15,
        fontFamily: FONTS.type.Bold,
        flex: 1,
    },
    iconName:{
        color: COLORS.text.white,
        marginRight: 15,
        padding: 5,
        paddingLeft: 6,
        paddingRight: 6,
        alignItems: 'center',
        justifyContent:'center',
        borderRadius: 8,
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
