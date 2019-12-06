import { COLORS, METRICS, FONTS } from '../../../themes';
import { Dimensions } from 'react-native';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;


const styles = {
    container: {
        flex: 1,
        position: "absolute",
        bottom: 0,
        padding: 15,
        width: "100%",
        height: 90,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: COLORS.backgroundColor,
        backgroundColor: '#1a1a1a'
    },
    image_view: {
        width: 50, 
        height: 50
    },
    actions:{
        width: width - 50,
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-between',
    },
    text_view: {
        width: width - 50 - 100,
        height: 50,
        paddingLeft: 10,
        justifyContent: 'center'
    },
    actionsRight:{
        flexDirection: 'row',
        width: 100,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    picture:{
        width: 50,
        height: 50,
        borderWidth:0,
        borderRadius: 8,
        backgroundColor: COLORS.emptyColor,
    },
    title: {
        color: COLORS.text.white,
        fontSize: 15,
        fontFamily: FONTS.type.Medium,
    },
    name: {
        color: COLORS.text.primary,
        fontSize: 14,
        fontFamily: FONTS.type.Medium,

    },
    icon:{
        color: COLORS.text.white,
        paddingRight: 15
    },
    containerInfo:{
        margin: 15,
        marginTop:0,
        marginBottom: 10,
        title:{
            color: COLORS.text.white,
            fontSize: 15,
            fontFamily: FONTS.type.Medium,
        }
    }

}
export default styles
