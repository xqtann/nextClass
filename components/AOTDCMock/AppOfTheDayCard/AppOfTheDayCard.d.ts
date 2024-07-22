import * as React from 'react';
import { StyleProp, ViewStyle, TextStyle, ImageStyle, ImageSourcePropType } from 'react-native';
interface IAppOfTheDayCardProps {
    title: string;
    iconSource: any;
    subtitle: string;
    largeTitle: string;
    buttonText: string;
    buttonSubtitle: string;
    backgroundSource: ImageSourcePropType;
    style?: StyleProp<ViewStyle>;
    iconStyle?: StyleProp<ImageStyle>;
    shadowStyle?: StyleProp<ViewStyle>;
    titleTextStyle?: StyleProp<TextStyle>;
    subtitleTextStyle?: StyleProp<TextStyle>;
    largeTitleTextStyle?: StyleProp<TextStyle>;
    buttonSubtitleTextStyle?: StyleProp<TextStyle>;
    gradientColors?: string[];
    onButtonPress: () => void;
    onPress: () => void;
}
declare const AppOfTheDayCard: React.FC<IAppOfTheDayCardProps>;
export default AppOfTheDayCard;
