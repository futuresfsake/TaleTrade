import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const LaunchScreen = ({ navigation }: any) => {
  return (
    <Pressable 
      style={styles.container} 
      onPress={() => navigation.replace('Login')}
    >

      {/* LOGO SECTION */}
      <View style={styles.logoContainer}>
        
        {/* Top Row: Tale + Logo */}
        <View style={styles.topRow}>
          <Text style={styles.tale}>Tale</Text>

          <Image
            source={require('../assets/Logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Second Line */}
        <Text style={styles.trade}>Trade</Text>
      </View>

      {/* WAVE */}
      <View style={styles.waveContainer}>
        <Svg height="240" width="100%" viewBox="0 0 1440 320">
          <Path
            fill="#6C63A8"
            d="
              M0,220
              C180,120 420,60 720,140
              C1020,220 1260,260 1440,160
              L1440,320
              L0,320
              Z
            "
          />
        </Svg>
      </View>

      <Text style={styles.tapText}>Tap anywhere</Text>

    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#E8DDC7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  tale: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#6C63A8',
    marginRight: 5,
  },

  trade: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#4A4A4A',
  },

  logoImage: {
    width: 50,
    height: 40,
    marginLeft: 5,
  },

  waveContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },

  tapText: { 
    position: 'absolute',
    bottom: 20,
    color: '#999',
    fontSize: 12,
  },
});

export default LaunchScreen;