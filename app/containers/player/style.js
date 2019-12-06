import { Dimensions } from 'react-native';
const width = Dimensions.get('window').width;
import { COLORS, FONTS } from '../../themes';

const styles = {
    container:{
        flex: 1
    },
    fixedContainer:{
        flex: 1,
        margin:0,
        padding:0,
        alignItems: 'center',
    },
    largePicture:{
        width: 280,
        height: 270,
        borderRadius: 30,
        marginTop: 30,
        backgroundColor: COLORS.emptyColor
    },
    title: {
        color: COLORS.text.white,
        fontSize: 25,
        fontFamily: FONTS.type.Bold,
        textAlign: "center",
        marginTop: 20
    },
    name: {
        color: COLORS.text.grey,
        fontSize: 19,
        fontFamily: FONTS.type.Bold,
        textAlign: "center",
    },
    headerIcon: {
        color: COLORS.text.white
    },
    blurImage: {
        position: "absolute",
        top: -90,
        left: 0,
        bottom: -90,
        right: 0
    },
    optionsContainer:{
        margin:0,
    },
    sliderContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    current_duration:{
        color: COLORS.text.grey,
        fontSize: 14,
        fontFamily: FONTS.type.Regular,
        marginRight: 8
    },
    total_duration:{
        fontSize: 14,
        fontFamily: FONTS.type.Regular,
        color: COLORS.text.grey,
        marginLeft: 8
    },
    track: {
        height: 4,
        width: width-120,
        borderRadius: 2,
    },
    thumb: {
        width: 15,
        height: 15,
        borderRadius: 15,
        // backgroundColor: COLORS.text.white,
        backgroundColor: COLORS.text.pink,
        // borderColor: COLORS.text.pink,
        // borderWidth: 2,
    },
    buttonContainer:{
        marginTop: 15,
        paddingBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rewindPlayFastContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    fastForward:{
        marginLeft: 15
    },
    rewind:{
        marginRight: 15
    },
    flatListContainer:{
        flex: 1,
        margin:0,
    },
    headerFlatList:{
        marginTop: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
}

export default styles
