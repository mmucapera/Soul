import React, { Component } from 'react';
import { View, Text, FlatList, SafeAreaView } from 'react-native';
import { PimaryButtonComponent, DefaultButtonComponent} from '../../components/form';
import styles from './styles/style.sort'
import strings from '../../localization/strings';
import _ from "lodash";

const VIEWABILITY_CONFIG = {
    minimumViewTime: 3000,
    viewAreaCoveragePercentThreshold: 95,
    waitForInteraction: true,
};

class SortModalContainer extends Component {

   componentDidMount(){
       const { state } = this.props.navigation;
       const params = state.params || {};
        _.forEach(params.options, function(value, key) {
            console.log(value, key);
        })
   }

    constructor(props) {
        super(props);
        this.state = {
            options: [
                {
                    name: "Songs",
                    icon: "music",
                    active: false
                },
                {
                    name: "Albums",
                    icon: "album",
                    active: false
                },
                {
                    name: "Playlists",
                    icon: "playlist-play",
                    active: false
                },
                {
                    name: "Artists",
                    icon: "microphone-variant",
                    active: false
                },
                {
                    name: "Downloaded",
                    icon: "cloud-download",
                    active: false
                }, 
                {
                    name: "Genres",
                    icon: "guitar-acoustic",
                    active: false
                },
                {
                    name: "Compilations",
                    icon: "buffer",
                    active: false
                },
                {
                    name: "Favorites",
                    icon: "heart",
                    active: false
                }, {
                    name: "Composers",
                    icon: "library-music",
                    active: false
                },
            ],
        }
    }
    onHideUnderlay = item => {
        item.active = false
        this.setState({ item });
    }
    onShowUnderlay = item => {
        console.log("item==", item)
        item.active = true
        this.setState({ item });
    }
    onPressOption = item => {
        console.log("item==", item)
    }

    onHandleDone = () => {
        console.log("item==0000")
        this.props.navigation.popToTop()
    }

    render() {
        const { options } = this.state;
        return (
            <SafeAreaView style={styles.container}> 
                <FlatList
                    style={styles.flatListContainer}
                    showsHorizontalScrollIndicator={false}
                   
                    viewabilityConfig={VIEWABILITY_CONFIG}
                    removeClippedSubviews
                    ListHeaderComponent={
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{strings.what_do_you_want_to_display}</Text>
                        </View>
                    }
                    data={options}
                    refFlatlist={(ref) => { this.refFlatlist = ref; }}
                    keyExtractor={(item, index) => item + index || item.id || index.toString()}
                    listKey={(index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <PimaryButtonComponent
                            index={index}
                            lastIndex={options.length - 1}
                            item={item}
                            onPress={() => this.onPressOption}
                            onHideUnderlay={this.onHideUnderlay}
                            onShowUnderlay={this.onShowUnderlay}
                        />
                    )}
                    numColumns={2}   
                    ListFooterComponent={
                        <View style={styles.footerContainer}>
                            <Text style={styles.footerTitle}>{strings.you_can_sort_it_as_you_want}</Text>
                            <DefaultButtonComponent buttonTitle={strings.done} onPress={this.onHandleDone} />
                        </View>
                    }            
                />
                
            </SafeAreaView>
        );
    }
}
export default SortModalContainer