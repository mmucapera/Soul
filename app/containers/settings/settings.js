import React from 'react';
import { View, Text, TouchableOpacity, Switch, Alert} from 'react-native';
import styles from './styles/setting.style';
import IconComponent from 'react-native-vector-icons/MaterialCommunityIcons'
import { IconCustomV2 } from '../../lib/IconCustom';
import { ACTION_STATE } from '../../utils/constant';


const ItemSetting = props => (
    <TouchableOpacity activeOpacity={0.8} style={[styles.wrapper]} onPress = {props.onPress}>
        <View style={[styles.iconName, { backgroundColor: props.item.backgroundColor }]}>
            <IconComponent name={props.item.iconName} size={18} color='white' />
        </View>
        <Text style={[styles.title]}>{props.item.name}</Text>

        <View>
            {props.item.name === ACTION_STATE.OFFLINE_MODEL &&
                <Switch onValueChange={() => props.toggleSwitch(props.offlineMode) } value={props.offlineMode} style={{marginRight: 10}}/>
            }
            {props.item.name !== ACTION_STATE.OFFLINE_MODEL &&
                <IconCustomV2 style={[styles.icon]}
                    name={props.item.iconNameRight} />
            }
           
        </View>

    </TouchableOpacity>
);
export default ItemSetting;
