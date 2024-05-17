import { Dimensions, StyleSheet } from 'react-native';
const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get('window');
export default StyleSheet.create({
    shadowStyle: {
        shadowColor: '#000',
        shadowRadius: 6,
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 0,
            height: 9,
        },
        elevation: 3,
    },
    backgroundStyle: {
        borderRadius: 8,
        width: ScreenWidth * 0.9,
        height: ScreenHeight * 0.5,
    },
    topHeaderContainer: {
        margin: 16,
        width: ScreenWidth * 0.7,
    },
    smallTitleTextStyle: {
        fontSize: 16,
        opacity: 0.8,
        color: '#ebe8f9',
        fontWeight: '700',
    },
    largeTitleTextStyle: {
        fontSize: 36,
        opacity: 0.9,
        color: '#fffdfe',
        fontWeight: '800',
    },
    bottomContainer: {
        left: 16,
        bottom: 16,
        width: '90%',
        position: 'absolute',
    },
    footnoteTextStyle: {
        fontSize: 12,
        color: '#fffdfe',
    },
});
//# sourceMappingURL=AppleCard.style.js.map