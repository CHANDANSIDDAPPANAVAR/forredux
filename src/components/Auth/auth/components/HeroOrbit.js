import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Image, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

/* ================= CONFIG ================= */
const RADIUS = width * 0.3;
const SPEED = 0.002;

/* ================= ICONS ================= */
const ORBIT_ICONS = [
  require('./utlits/assets/Love.png'),
  require('./utlits/assets/family.png'),
  require('./utlits/assets/frinds.png'),
  require('./utlits/assets/explor.png'),
  require('./utlits/assets/market.png'),
  require('./utlits/assets/advant.png'),
  require('./utlits/assets/professional.png'),
  require('./utlits/assets/educationl.png'),
  require('./utlits/assets/global.png'),
  require('./utlits/assets/tech.png'),
];

const HeroOrbit = () => {
  const raf = useRef(null);
  const [angle, setAngle] = useState(0);

  /* ================= ORBIT LOOP ================= */
  useEffect(() => {
    const animate = () => {
      setAngle(a => a + SPEED);
      raf.current = requestAnimationFrame(animate);
    };

    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const step = (2 * Math.PI) / ORBIT_ICONS.length;

  return (
    <View style={styles.heroSection}>
      <View style={styles.heroContainer}>
        {ORBIT_ICONS.map((icon, index) => {
          const theta = angle + index * step;
          const x = Math.cos(theta) * RADIUS;
          const y = Math.sin(theta) * RADIUS;

          return (
            <View
              key={index}
              style={[
                styles.iconWrapper,
                { transform: [{ translateX: x }, { translateY: y }] },
              ]}
            >
              <Image source={icon} style={styles.icon} />
            </View>
          );
        })}

        {/* CENTER LOGO */}
        <Image
          source={require('../../../assets/oneconnetrylogo.png')}
          style={styles.centerLogo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

export default HeroOrbit;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  heroSection: {
    paddingTop: Platform.OS === 'ios' ? 56 : 42,
    alignItems: 'center',
  },

  heroContainer: {
    width,
    height: width * 0.9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconWrapper: {
    position: 'absolute',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.55,
  },

  icon: {
    width: 34,
    height: 34,
    resizeMode: 'contain',
  },

  centerLogo: {
    width: width * 0.4,
    height: width * 0.4,
  },
});
