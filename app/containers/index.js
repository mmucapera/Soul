import React, { Component } from 'react';
import { StatusBar } from 'react-native';

import AppNavigator from '../navigators/routes'
import DropdownAlert from 'react-native-dropdownalert';
import DropDownHolder from '../lib/DropDownHolder';
import ErrorBoundry from '../components/boundry';

class RootContainer extends Component {
    render() {
        return (
            <React.Fragment>
            <ErrorBoundry navigation={this.props.navigation}>
                <AppNavigator />
                <StatusBar barStyle="light-content" />
                <DropdownAlert
                    panResponderEnabled={false}
                    titleNumOfLines={2}
                    inactiveStatusBarBackgroundColor="transparent"
                    ref={ref => DropDownHolder.setDropDown(ref)}
                />
            </ErrorBoundry>
            </React.Fragment>
        )
    }
}
export default RootContainer;
