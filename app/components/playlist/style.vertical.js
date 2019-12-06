import { Dimensions } from 'react-native'
import { COLORS, FONTS } from '../../themes';
const width = ((Dimensions.get('window').width) / 2) - 30
const styles = {
    container: {
        flex: 1,
        marginBottom: 15
    },
    largePicture: {
        borderRadius: 15,
        width: width,
        height: 150,
        backgroundColor: COLORS.emptyColor
    },
    title: {
        marginTop: 10,
        color: COLORS.text.white,
        fontSize: 16,
        fontFamily: FONTS.type.Medium,
        width: width,
    },
    name: {
        color: COLORS.text.primary,
        fontSize: 15,
        fontFamily: FONTS.type.Medium,
        width: width,
    }

};
export default styles;

