
import { METRICS } from '../../../themes';
const styles = {
    explore: {
        rowWrapper: {
            marginTop: 0,
            padding: 15,
            marginLeft: 15,
            marginRight: 15,
            marginBottom: 15,
            height: 154,
            backgroundColor: '#fcfdff',
            borderRadius: 8,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.1,
            zIndex: 998,
            container: {
                flex: 1,
                flexDirection: 'row',
                vertical_image: {
                    width: 100,
                    height: 90,
                    borderRadius: 5,
                    backgroundColor: '#DEE1E6',
                },
                columWrapper: {
                    flex: 1,
                    flexDirection: 'column',
                    marginLeft: 10,
                    marginTop: 1
                },
                column: {
                    width: '50%',
                    borderRadius: 3,
                    marginBottom: METRICS.baseMargin / 1.5,
                    paddingVertical: METRICS.baseMargin / 1.5,
                    paddingHorizontal: METRICS.baseMargin / 1.5,
                    backgroundColor: '#DEE1E6',
                },
            },
            containerBottom: {
                columWrapper: {
                    flex: 1,
                    flexDirection: 'column',
                    marginLeft: 10,
                    marginTop: 2
                },
                column: {
                    width: 140,
                    borderRadius: 3,
                    marginBottom: METRICS.baseMargin / 2,
                    paddingVertical: METRICS.baseMargin / 1,
                    paddingHorizontal: METRICS.baseMargin / 1.5,
                    backgroundColor: '#DEE1E6',
                },
            }
        },
    }
}
export default styles;
