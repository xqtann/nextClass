import * as React from 'react';
import { StyleProp, ViewStyle, TextStyle, ImageSourcePropType } from 'react-native';
interface IProps {
    source: ImageSourcePropType;
    smallTitle: string;
    largeTitle: string;
    footnote: string;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
    shadowStyle?: StyleProp<ViewStyle>;
    backgroundStyle?: StyleProp<ViewStyle>;
    footnoteTextStyle?: StyleProp<TextStyle>;
    smallTitleTextStyle?: StyleProp<TextStyle>;
    largeTitleTextStyle?: StyleProp<TextStyle>;
}
declare const AppleCard: React.FC<IProps>;
export default AppleCard;
