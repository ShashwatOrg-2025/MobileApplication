// src/components/CustomBottomSheet.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.85;
const SHEET_MIN_HEIGHT = SCREEN_HEIGHT * 0.15;

const CustomBottomSheet = ({ children }) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const lastY = React.useRef(0);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        animatedValue.setOffset(lastY.current);
      },
      onPanResponderMove: (e, gesture) => {
        animatedValue.setValue(gesture.dy);
      },
      onPanResponderRelease: (e, gesture) => {
        animatedValue.flattenOffset();
        lastY.current += gesture.dy;

        if (gesture.vy > 0.5 || gesture.dy > SHEET_MAX_HEIGHT / 2) {
          // Drag down - close
          springAnimation('down');
        } else {
          // Drag up - open
          springAnimation('up');
        }
      },
    })
  ).current;

  const springAnimation = (direction) => {
    const toValue = direction === 'down' ? 0 : -(SHEET_MAX_HEIGHT - SHEET_MIN_HEIGHT);
    lastY.current = toValue;
    Animated.spring(animatedValue, {
      toValue,
      tension: 40,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const sheetStyle = {
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [-(SHEET_MAX_HEIGHT - SHEET_MIN_HEIGHT), 0],
          outputRange: [-(SHEET_MAX_HEIGHT - SHEET_MIN_HEIGHT), 0],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  return (
    <Animated.View style={[styles.bottomSheet, sheetStyle]}>
      <View style={styles.draggableArea} {...panResponder.panHandlers}>
        <View style={styles.dragHandle} />
      </View>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    position: 'absolute',
    bottom: -SHEET_MAX_HEIGHT + SHEET_MIN_HEIGHT,
    left: 0,
    right: 0,
    height: SHEET_MAX_HEIGHT,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  draggableArea: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  dragHandle: {
    width: 50,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 10,
  },
});

export default CustomBottomSheet;
