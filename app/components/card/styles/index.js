import { Dimensions } from 'react-native'
import { COLORS, FONTS } from '../../../themes';
const width = (Dimensions.get('window').width - (50 + 2 * 2)) / 2
const styles ={
    container: {
        flex: 1,
        marginBottom: 15
    },
    picture:{
        borderRadius: 15,
        width: width - 10,
        height: 130,
        backgroundColor: COLORS.emptyColor
    },
    largePicture:{
        borderRadius: 15,
        width: width + 2, 
        height: 150,
        backgroundColor: COLORS.emptyColor
    },
    title:{
        marginTop: 10,
        color: COLORS.text.white,
        fontSize: 15,
        fontFamily: FONTS.type.Medium,
        width: width,
    },
    name:{
        color: COLORS.text.primary,
        fontSize: 15,
        fontFamily: FONTS.type.Medium,
        width: width,
    }

};
export default styles;

