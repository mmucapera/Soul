import React, {Component} from 'react';
import { View, Text, SafeAreaView, ScrollView, FlatList } from 'react-native';
import { MinPlayerComponent } from '../../components/player';
import { FlatListHeader } from '../../components/header';
import { FeaturedStationsComponent,PopularStationsComponent, RecentlyPlayedStationsComponent} from '../../components/stations';

import strings from '../../localization/strings';
import { STYLES } from '../../themes'
import style from './styles'

const VIEWABILITY_CONFIG = {
  minimumViewTime: 3000,
  viewAreaCoveragePercentThreshold: 95,
  waitForInteraction: true,
};

class RadioContainer extends Component {

    static navigationOptions = ({ }) => {
      return {
        headerLeft: (<View style={STYLES.headerContainer}><Text style={STYLES.headerContainer.title}>{strings.radio}</Text></View>)
      };
    }
    constructor(props) {
      super(props);
      this.state = {
        featured_items:[
          {
            name: "Again",
            picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/2sz5.jpg"
          },
          {
            name: "Paradise",
            picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/3sz5.jpg"
          },
          {
            name: "How People Move",
            picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/4sz5.jpg"
          },
          {
            name: "Stay Young",
            picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/5sz5.jpg"
          },
          {
            name: "The Others",
            picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/6sz5.jpg"
          }
        ],
        popular_items:[
          {
            name: "Too Much",
            picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/12sz5.jpg"
          },
          {
            name: "Rainbow Sea",
            picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/14sz5.jpg"
          },
          {
            name: "A Day With You",
            picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/15sz5.jpg"
          },
          {
            name: "Naked All Night",
            picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/16sz5.jpg"
          }
        ],
        recently_items:[
          {
            name: "Paradise",
            picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/88sz5.jpg"
          },
          {
            name: "Half Moon",
            picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/184sz5.jpg"
          },
          {
            name: "Breathe",
            picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/87sz5.jpg"
          },
          {
            name: "I Love My 90's",
            picture: "https://biobutterfly.com/wp-content/themes/musicapp/src/images/artist/85sz5.jpg"
          }
        ]
      };
  }
  UNSAFE_componentWillMount() {
    const { popular_items } = this.state
    let arrayItems = [], size = 2;
    while (popular_items.length > 0) {
      arrayItems.push(popular_items.splice(0, size));
    }
    this.setState({ popular_items: arrayItems })
  }

  onPress = item => {
    this.props.navigation.navigate('Albums')
  }
  onHandlePlayer = items => {
    this.props.navigation.navigate('Player')
  }
  render() {
      const { featured_items, popular_items, recently_items } = this.state
      return (
        <SafeAreaView style={STYLES.container}>
          <ScrollView scrollEventThrottle={16}>
            <View style={style.container}>
              <FlatListHeader title={strings.featured_stations} />
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  viewabilityConfig={VIEWABILITY_CONFIG}
                  removeClippedSubviews
                  data={featured_items}
                  refFlatlist={(ref) => { this.refFlatlist = ref; }}
                  keyExtractor={(item, index) => item + index || item.id || index.toString()}
                  listKey={(index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <FeaturedStationsComponent
                      index={index}
                      lastIndex={featured_items.length - 1}
                      item={item}
                      onPress={this.onPress}
                    />
                  )}
                />
              </ScrollView>
            </View>
            <View style={style.container}>
              <FlatListHeader title={strings.popular_stations} />
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  viewabilityConfig={VIEWABILITY_CONFIG}
                  removeClippedSubviews
                  data={popular_items}
                  refFlatlist={(ref) => { this.refFlatlist = ref; }}
                  keyExtractor={(item, index) => item + index || item.id || index.toString()}
                  listKey={(index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <PopularStationsComponent
                      index={index}
                      lastIndex={popular_items.length - 1}
                      items={item}
                      onPress={this.onPress}
                    />
                  )}
                />
              </ScrollView>
            </View>
            <View style={[style.container, STYLES.scrollContainer]}>
              <FlatListHeader title={strings.recently_played} />
              <FlatList
                showsHorizontalScrollIndicator={false}
                viewabilityConfig={VIEWABILITY_CONFIG}
                removeClippedSubviews
                data={recently_items}
                refFlatlist={(ref) => { this.refFlatlist = ref; }}
                keyExtractor={(item, index) => item + index || item.id || index.toString()}
                listKey={(index) => index.toString()}
                renderItem={({ item, index }) => (
                  <RecentlyPlayedStationsComponent
                    index={index}
                    lastIndex={recently_items.length - 1}
                    item={item}
                    onPress={this.onPress}
                  />
                )}
                numColumns={2}
              />
            </View>
          </ScrollView>
          <MinPlayerComponent onPress={this.onHandlePlayer} />
        </SafeAreaView>
      );
    }

  }
  export default RadioContainer