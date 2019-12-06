import { Dimensions } from 'react-native'
import { COLORS, FONTS } from '../../themes';
const width = ((Dimensions.get('window').width) / 2) - 30
const styles = {
    container: {
        flex: 1,
        marginBottom: 15
    },
    largePicture: {
        borderRadius: width/2,
        width: width,
        height: 150,
        backgroundColor: COLORS.emptyColor,
        marginBottom: 8
    },
    name: {
        color: COLORS.text.primary,
        fontSize: 18,
        fontFamily: FONTS.type.Medium,
        width: width,
        textAlign: "center",
    }

};
export default styles;

