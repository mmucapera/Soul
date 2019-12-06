import { COLORS, FONTS } from '../../../themes';
import { Dimensions } from 'react-native'
const width = Dimensions.get('window').width

const styles = {
    container: {
        flex: 1,
        
    },
    containerRow:{
        flexDirection: 'row',
        width: width - 40,
        marginBottom: 10,
    },
    actionTitle:{
        flex: 1,
        marginLeft: 10,
        justifyContent: 'center',
    },
    actionIcon:{
        alignItems: 'stretch',
        justifyContent: 'center',
        iconDotDot: {
            marginRight: 20,
            color: COLORS.text.white,
        },
    },
    picture: {
        borderRadius: 15,
        width: 65,
        height: 65,
        backgroundColor: COLORS.emptyColor
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
// const styles = {
//     container: {
//         flex: 1,
//         marginBottom: 0,
//         alignItems: "center",
//         marginRight: 10,
//         marginBottom: 8
//     },
//     picture: {
//         borderRadius: 15,
//         width: 125,
//         height: 125,
//         backgroundColor: COLORS.emptyColor,
//     },
//     title:{
//         marginTop: 10,
//         color: COLORS.text.white,
//         fontSize: 15,
//         fontFamily: FONTS.type.Medium,
//         // width: width,
//     },
//     name:{
//         color: COLORS.text.primary,
//         fontSize: 15,
//         fontFamily: FONTS.type.Medium,
//         // width: width,
//     }

// };
export default styles;

