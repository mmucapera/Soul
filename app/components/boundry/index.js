import React from 'react';
import { Text, View, SafeAreaView } from 'react-native';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            system: null,
            screen: null,
        };
    }
    static navigationOptions = {
        title: null,
    };

    componentDidCatch(error, info) {
        try {
            this.setState({
                hasError: true,
                system: error.message,
                screen: info.componentStack,
            });
        } catch (errorCatch) {
        }
    }
    submitErorr = (userMessage, auto = false) => {
      
    }
    render() {
        if (this.state.hasError) {
            return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Something went wrong!</Text>   
             </View>;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
