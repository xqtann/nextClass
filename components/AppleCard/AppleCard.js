import * as React from 'react';
import { Text, View, ImageBackground, } from 'react-native';
import RNBounceable from '@freakycoder/react-native-bounceable';
/**
 * ? Local Imports
 */
import styles from './AppleCard.style';
const AppleCard = ({ source, style, footnote, footnoteTextStyle, backgroundStyle, smallTitle, largeTitle, shadowStyle, smallTitleTextStyle, largeTitleTextStyle, onPress, ...rest }) => {
    return (<View style={[styles.shadowStyle, shadowStyle]}>
      <RNBounceable bounceEffectIn={0.95} {...rest} style={style} onPress={onPress}>
        <ImageBackground {...rest} source={source} borderRadius={8} resizeMode="cover" style={[styles.backgroundStyle, backgroundStyle]}>
          <View style={styles.topHeaderContainer}>
            <Text style={[styles.smallTitleTextStyle, smallTitleTextStyle]}>
              {smallTitle}
            </Text>
            <Text style={[styles.largeTitleTextStyle, largeTitleTextStyle]}>
              {largeTitle}
            </Text>
          </View>
          <View style={styles.bottomContainer}>
            <Text style={[styles.footnoteTextStyle, footnoteTextStyle]}>
              {footnote}
            </Text>
          </View>
        </ImageBackground>
      </RNBounceable>
    </View>);
};
export default AppleCard;
//# sourceMappingURL=AppleCard.js.map