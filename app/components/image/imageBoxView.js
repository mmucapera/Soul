import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
} from 'react-native';

import { IconCustom } from '../../lib/IconCustom';

import { COLORS, FONTS } from '../../themes';

const imgSizeXXS = {
    width: 20,
    height: 20,
};
const imgSizeXXSS = {
    width: 15,
    height: 15,
};
const imgSizeXSS = {
    width: 25,
    height: 25,
};
const imgSizeXSM = {
    width: 35,
    height: 35,
};
const imgSizeXS = {
    width: 40,
    height: 40,
};
const imgSizeSM = {
    width: 60,
    height: 60,
};
const imgSizeMD = {
    width: 80,
    height: 80,
};
const imgSizeLG = {
    width: 120,
    height: 120,
};


const getImgSize = (boxSize) => {
    let getImageSize = 0;
    switch (boxSize) {
        case 'xxss':
            getImageSize = imgSizeXXSS;
            break;

        case 'xxs':
            getImageSize = imgSizeXSS;
            break;

        case 'xss':
            getImageSize = imgSizeXSS;
            break;

        case 'xsm':
            getImageSize = imgSizeXSM;
            break;

        case 'xs':
            getImageSize = imgSizeXS;
            break;

        case 'sm':
            getImageSize = imgSizeSM;
            break;

        case 'md':
            getImageSize = imgSizeMD;
            break;

        default:
            getImageSize = imgSizeLG;
            break;
    }

    return getImageSize;
};

const getRadiusVal = (boxSize) => getImgSize(boxSize).width / 2;

const styles = StyleSheet.create({
    imgStyle: {
        resizeMode: 'cover',
    },
    imgStyleContain: {
        resizeMode: 'contain',
    },
    emptyBox: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    boxRadius: {
        borderRadius: 4,
        borderWidth: 0,
    },
    boxSizeXXS: {
        width: imgSizeXXS.width,
        height: imgSizeXXS.height,
    },
    boxSizeXXSS: {
        width: imgSizeXXSS.width,
        height: imgSizeXXSS.height,
    },
    boxSizeXSS: {
        width: imgSizeXSS.width,
        height: imgSizeXSS.height,
    },
    boxSizeXSM: {
        width: imgSizeXSM.width,
        height: imgSizeXSM.height,
    },
    boxSizeXS: {
        width: imgSizeXS.width,
        height: imgSizeXS.height,
    },
    boxSizeSM: {
        width: imgSizeSM.width,
        height: imgSizeSM.height,
    },
    boxSizeMD: {
        width: imgSizeMD.width,
        height: imgSizeMD.height,
    },
    boxSizeLG: {
        width: imgSizeLG.width,
        height: imgSizeLG.height,
    },
    labelShortCut: {
        color: COLORS.text.white,
        fontSize: FONTS.size.input,
        fontWeight: 'bold',
    },
});

const ImageBoxView = ({
    isEmptyGrayBox,
    source,
    containStyle,
    boxSize,
    isRadius,
    isCircle,
    customStyle,
    label,
    icon,
    resizeMode
}) => {
    if (isEmptyGrayBox && !source) {
        return (
            <View
                style={[
                    styles.emptyBox,
                    isRadius && styles.boxRadius,
                    boxSize === 'xxss' && styles.boxSizeXXSS,
                    boxSize === 'xxs' && styles.boxSizeXXS,
                    boxSize === 'xss' && styles.boxSizeXSS,
                    boxSize === 'xsm' && styles.boxSizeXSM,
                    boxSize === 'xs' && styles.boxSizeXS,
                    boxSize === 'sm' && styles.boxSizeSM,
                    boxSize === 'md' && styles.boxSizeMD,
                    boxSize === 'lg' && styles.boxSizeLG,
                    isCircle && { borderRadius: getRadiusVal(boxSize) },
                    customStyle,
                ]}
            >
                {label && <Text style={styles.labelShortCut}>{label}</Text>}
                {icon && <IconCustom name={icon} style={styles.labelShortCut} />}
            </View>
        );
    }

    return (
        <Image
            resizeMode={resizeMode}
            source={source}
            style={[
                styles.imgStyle,
                containStyle && styles.imgStyleContain,
                isRadius && styles.boxRadius,
                boxSize === 'xxss' && styles.boxSizeXXSS,
                boxSize === 'xxs' && styles.boxSizeXXS,
                boxSize === 'xss' && styles.boxSizeXSS,
                boxSize === 'xsm' && styles.boxSizeXSM,
                boxSize === 'xs' && styles.boxSizeXS,
                boxSize === 'sm' && styles.boxSizeSM,
                boxSize === 'md' && styles.boxSizeMD,
                boxSize === 'lg' && styles.boxSizeLG,
                isCircle && { borderRadius: getRadiusVal(boxSize) },
                customStyle,
            ]}
        />
    );
};

export default ImageBoxView;
