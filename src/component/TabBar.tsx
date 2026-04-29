import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { Home, Search, User } from 'lucide-react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const { width } = Dimensions.get('window');

// Colors from your palette
const COLORS = {
  primaryBlue: '#4A68BE',
  softPurple: '#7E6FB0',
  creamBg: '#F5E9CF',
  white: '#FFFFFF',
};

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          // Determine the label
          const label = options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Icon Logic - Matching your TabNavigator screen names
          const renderIcon = (color: string) => {
            const iconProps = {
              color,
              size: 22,
              strokeWidth: isFocused ? 2.5 : 2
            };

            switch (route.name) {
              case 'Home':
                return <Home {...iconProps} />;
              case 'Search': // Matches the name in your TabNavigator.tsx
                return <Search {...iconProps} />;
              case 'Profile':
                return <User {...iconProps} />;
              default:
                return <Home {...iconProps} />;
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              activeOpacity={0.7}
              style={[
                styles.tabItem,
                isFocused && styles.activeTabItem
              ]}
            >
              {renderIcon(isFocused ? COLORS.primaryBlue : COLORS.softPurple)}

              {isFocused && (
                <Text style={styles.label}>
                  {typeof label === 'string' ? label : route.name}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 34 : 20, // Adjusted for safe areas
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.creamBg,
    width: width * 0.88, // Slightly slimmer for a cleaner look
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 35,
    justifyContent: 'space-between', // Spaces items evenly
    alignItems: 'center',
    // Cutesy shadow
    shadowColor: COLORS.softPurple,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    paddingHorizontal: 15,
    borderRadius: 25,
  },
  activeTabItem: {
    backgroundColor: COLORS.white,
    // Soft inner-glow style shadow for the pill
    shadowColor: COLORS.primaryBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryBlue,
  },
});

export default TabBar;