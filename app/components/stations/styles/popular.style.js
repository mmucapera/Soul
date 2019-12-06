import { COLORS, FONTS } from '../../../themes';
import { Dimensions } from 'react-native'
const width = Dimensions.get('window').width

const styles = {
    container: {
        flex: 1
    },
    containerRow: {
        flexDirection: 'row',
        width: width - 40,
        marginBottom: 10,
    },
    actionTitle: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'center',
    },
    picture: {
        borderRadius: 15,
        width: 65,
        height: 65,
        backgroundColor: COLORS.emptyColor
    },
    name: {
        color: COLORS.text.primary,
        fontSize: 18,
        fontFamily: FONTS.type.Medium,
    }

};
export default styles;

