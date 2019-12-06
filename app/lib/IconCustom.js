import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '@assets/svg/svg-icon.json';
import icoMoonConfigV2 from '@assets/svg/svg-icon-v2.json';
export const IconCustom = createIconSetFromIcoMoon(icoMoonConfig, '', 'icomoon.ttf');
export const IconCustomV2 = createIconSetFromIcoMoon(icoMoonConfigV2, 'icomoonV2', 'icomoonV2.ttf');
