import React, { Component } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo'

import strings from '../../localization/strings';
import { STYLES, COLORS } from '../../themes'
import style from './styles'


class BrowseContainer extends Component {

    static navigationOptions = ({ }) => {
        return {
            headerLeft: (<View style={STYLES.headerContainer}>
                <Text style={STYLES.headerContainer.title}>{strings.browse}</Text>
            </View>),
            headerRight: (<View style={STYLES.headerContainer}>
                <TouchableOpacity><Icon name="list" size={24} color={COLORS.text.primary} /></TouchableOpacity>
            </View>)
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            items: {
                recently_added: [
                    {
                        title: "Soft Life",
                        name: "Jodie",
                        picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/22sz5.jpg"
                    },
                    {
                        title: "Happy Accidents",
                        name: "Beatrice",
                        picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/24sz5.jpg"
                    },
                    {
                        title: "A Fantasy Trip",
                        name: "Kandi Landi",
                        picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/26sz5.jpg"
                    },
                    {
                        title: "The Good Life",
                        name: "Cassarah",
                        picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/26sz5.jpg"
                    }
                ],
                recently_played: [
                    {
                        title: "Man of Dust",
                        name: "Taiyon",
                        picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/10sz5.jpg"
                    },
                    {
                        title: "Don't Recall",
                        name: "Kard",
                        picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/11sz5.jpg"
                    },
                    {
                        title: "Streams",
                        name: "Kard",
                        picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/11sz5.jpg"
                    },
                    {
                        title: "Uncovered",
                        name: "Kard",
                        picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/12sz5.jpg"
                    }
                ]
            }
        };
    }
    render() {
        return (
            <SafeAreaView style={STYLES.container}>
                <ScrollView scrollEventThrottle={16}>

                    <View style={style.container}>
                        <View>
                            <Text style={STYLES.headerTitle}>
                                {strings.recently_added}
                            </Text>
                        </View>

                        <View>
                            <Text style={STYLES.headerTitle}>
                                {strings.recently_played}
                            </Text>
                        </View>

                    </View>

                </ScrollView>
            </SafeAreaView>
        );
    }
}
export default BrowseContainer