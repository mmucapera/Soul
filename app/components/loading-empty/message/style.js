
import { METRICS } from '../../../themes';
const styles = {
    explore: {
        rowWrapper: {
            padding: 15,
            marginLeft: 15,
            marginRight: 15,
            marginBottom: 15,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            height: 90,
            backgroundColor: '#fcfdff',
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
                    width: 60,
                    height: 60,
                    borderRadius: 8,
                    backgroundColor: '#DEE1E6',
                },
                columWrapper: {
                    flex: 1,
                    flexDirection: 'column',
                    marginLeft: 10,
                    marginTop: 10
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
