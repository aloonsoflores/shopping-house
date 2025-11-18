import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const screenWidth = width;
export const screenHeight = height;

export const isSmallDevice = width < 375;
export const isMediumDevice = width >= 375 && width < 768;
export const isLargeDevice = width >= 768;

export const responsiveSize = (size: number) => {
  if (isSmallDevice) {
    return size * 0.9;
  }
  if (isLargeDevice) {
    return size * 1.1;
  }
  return size;
};

export const maxContentWidth = isLargeDevice ? 600 : width;

export const horizontalPadding = isSmallDevice ? 16 : isMediumDevice ? 20 : 24;
