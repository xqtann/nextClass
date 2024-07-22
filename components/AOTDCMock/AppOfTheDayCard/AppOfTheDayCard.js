import * as React from 'react';
import { Text, View, Image, ImageBackground, } from 'react-native';
import RNBounceable from '@freakycoder/react-native-bounceable';
/**
 * ? Local Imports
 */
import styles from './AppOfTheDayCard.style';
const AppOfTheDayCard = ({ style, title, subtitle, largeTitle, buttonSubtitle, iconStyle, iconSource, shadowStyle, backgroundSource, titleTextStyle, subtitleTextStyle, largeTitleTextStyle, buttonSubtitleTextStyle, onButtonPress, buttonText, onPress, ...rest }) => {
    const renderLargeTitle = () => (<Text style={[styles.largeTitleTextStyle, largeTitleTextStyle]}>
      {largeTitle}
    </Text>);
    const renderIcon = () => (<Image borderRadius={12} resizeMode="cover" source={iconSource} style={[styles.iconStyle, iconStyle]}/>);
    const renderTitleContainer = () => (<View style={styles.titleContainer}>
      <Text numberOfLines={2} style={[styles.titleTextStyle, titleTextStyle]}>
        {title}
      </Text>
      <Text numberOfLines={1} style={[styles.subtitleTextStyle, subtitleTextStyle]}>
        {subtitle}
      </Text>
    </View>);
    const renderButtonContainer = () => (<View style={styles.buttonContainer}>
      <RNBounceable style={styles.buttonInnerContainer} onPress={onButtonPress}>
        <Text style={styles.buttonTextStyle}>{buttonText}</Text>
      </RNBounceable>
      <Text style={[styles.buttonSubtitleTextStyle, buttonSubtitleTextStyle]}>
        {buttonSubtitle}
      </Text>
    </View>);
    const renderBottomBar = () => (<View style={styles.bottomBarStyle}>
      <View style={styles.innerBottomBarStyle}>
        {renderIcon()}
        {renderTitleContainer()}
      </View>
    </View>);
    return (<View style={[styles.shadowStyle, shadowStyle]}>
      <RNBounceable bounceEffectIn={0.95} {...rest} style={[styles.container, style]} onPress={onPress}>
        <ImageBackground borderRadius={8} resizeMode="cover" {...rest} style={[styles.container, style]} source={backgroundSource}>
          <View style={styles.innerContainer}>
            {renderLargeTitle()}
            {renderBottomBar()}
          </View>
        </ImageBackground>
      </RNBounceable>
    </View>);
};
export default AppOfTheDayCard;
//# sourceMappingURL=AppOfTheDayCard.js.map