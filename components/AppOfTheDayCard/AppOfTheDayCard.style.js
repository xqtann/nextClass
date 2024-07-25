import { StyleSheet, Dimensions, } from 'react-native';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get('window');
export default StyleSheet.create({
    container: {
        height: 140,
        width: ScreenWidth * 0.9,
        borderRadius: 8,
        flexDirection: 'column',
    },
    shadowStyle: {
        flex: 1,
        shadowColor: '#000',
        shadowRadius: 6,
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        elevation: 3,
    },
    innerContainer: {
        left: 16,
        top: 16,
        position: 'absolute',
        width: ScreenWidth * 0.9 - 32,
    },
    largeTitleTextStyle: {
        fontSize: 35,
        lineHeight: 35,
        color: '#fffeff',
        fontWeight: '900',
        fontFamily: 'System',
        textAlign: 'justify',
        width: ScreenWidth * 0.8,
    },
    bottomBarStyle: {
        right: 16,
        height: 75,
        width: ScreenWidth * 0.9,
        borderBottomEndRadius: 8,
        borderBottomStartRadius: 8,
    },
    innerBottomBarStyle: {
        marginHorizontal: 16,
        marginTop: 10,
        flexDirection: 'row',
    },
    iconStyle: {
    },
    titleContainer: {
        width: 200,
    },
    titleTextStyle: {
        fontSize: 20,
        color: 'white',
        fontWeight: '700',
        fontFamily: 'System',
    },
    subtitleTextStyle: {
        marginTop: 3,
        fontSize: 20,
        color: 'white',
        fontWeight: '600',
        fontFamily: 'System',
    },
    buttonContainer: {
        top: 8,
        right: 4,
        position: 'absolute',
    },
    buttonInnerContainer: {
        width: 75,
        height: 30,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f1f6',
    },
    buttonTextStyle: {
        color: '#056dff',
        fontWeight: '700',
        textAlign: 'center',
    },
    buttonSubtitleTextStyle: {
        fontSize: 8,
        marginTop: 5,
        marginLeft: 3,
        color: 'white',
        fontWeight: '400',
    },
});
//# sourceMappingURL=AppOfTheDayCard.style.js.map