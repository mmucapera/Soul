import { COLORS, FONTS, METRICS } from '../../../themes'

const styles = {
    seperatorBorderBottom: {
        backgroundColor: COLORS.text.grey,
        padding: 0.5,
    },
    tabsContainerStyle: {
        marginLeft: 15,
        marginRight: 15,
        marginTop: 5,
        height: 30
    },
    tabStyle: {
        borderColor: 0,
        backgroundColor: COLORS.backgroundGreyColor
    },
    firstTabStyle: {
        //custom styles
    },
    lastTabStyle: {
        
        //custom styles
    },
    tabTextStyle: {
        color: COLORS.text.primary,
        fontSize: 14,
        fontFamily: FONTS.type.Regular,
    },
    activeTabStyle: {
        color: COLORS.text.white,
        backgroundColor: COLORS.text.primary
    },
    activeTabTextStyle: {
        //custom styles,
        fontSize: 14,
        fontFamily: FONTS.type.Regular,
    },
    tabBadgeContainerStyle: {
        //custom styles
    },
    activeTabBadgeContainerStyle: {
        //custom styles
    },
    tabBadgeStyle: {
        //custom styles
    },
    activeTabBadgeStyle: {
        //custom styles
    }
}
export default styles
