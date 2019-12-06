import { COLORS, METRICS, FONTS } from '../../../themes';

const styles = {
    container: {
        justifyContent: 'space-between',
        alignItems: "center",
        flexDirection: 'row',
    },
    button:{
        backgroundColor: COLORS.backgroundGreyColor,
        borderRadius: 10,
        padding: 10,
        paddingLeft: 14,
        paddingRight: 14,
        flex: 1,
        marginBottom: 10,  
    },
    name:{
        color: COLORS.text.grey,
        fontSize: 15,
        fontFamily: FONTS.type.Medium,
        alignSelf:"flex-start"
    },
    icon:{
        color: COLORS.text.primary,
        alignSelf: "flex-end"
    }
}
export default styles
