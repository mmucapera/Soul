import FONTS from '../themes/fonts'
import { COLORS } from '../themes'

const styles = {
    container:{
        flex: 1,
        backgroundColor: COLORS.backgroundColor,
        color: COLORS.text.white,
    },
    scrollContainer:{
        marginBottom: 90
    },
    headerContainer:{
        paddingLeft: 15,
        justifyContent: 'center',
        flexDirection: 'row',
        paddingRight: 15,
        title: {
            fontSize: 26,
            fontFamily: FONTS.type.Bold,
            color: COLORS.text.white,
        }
    },
  
   
}

export default styles
