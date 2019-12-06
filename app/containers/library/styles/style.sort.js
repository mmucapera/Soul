import { COLORS, FONTS } from '../../../themes';

const styles = {
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundColor
    },
    flatListContainer:{
        margin: 15,
    },
    titleContainer:{
        marginTop: 25,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 15,
        width: 200,
    },
    title:{
        fontSize: 22,
        fontFamily: FONTS.type.Medium,
        color: COLORS.text.white
    },
    footerContainer:{
        margin: 20,
        marginTop: 25,
    },
    footerTitle:{
        fontSize: 16,
        fontFamily: FONTS.type.Medium,
        color: COLORS.text.white,
        textAlign: "center",
        marginBottom: 15,

    },
}

export default styles
