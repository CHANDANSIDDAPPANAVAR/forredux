import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  Dimensions,
} from 'react-native';

import love from './assets/Love.png';
import buss from './assets/Buss.png';
import prof from './assets/professional.png';
import event from './assets/event.png';
import educ from './assets/educationl.png';
import skill from './assets/skill.png';
import frinds from './assets/frinds.png';
import creat from './assets/creativit.png';
import helth from './assets/healthyw.png';
import tech from './assets/tech.png';
import serv from './assets/servic.png';
import hobby from './assets/hobbys.png';
import enter from './assets/entertin.png';
import travl from './assets/traval.png';
import global from './assets/global.png';
import life from './assets/lifestyl.png';
import soil from './assets/socialipm.png';
import mark from './assets/market.png';
import adva from './assets/advant.png';
import alum from './assets/alumin.png';
import faml from './assets/family.png';
import sport from './assets/sport.png';
import fininc from './assets/finince.png';
import food from './assets/food.png';
import scinc from './assets/scince.png';
import explo from './assets/explor.png';
import lega from './assets/legal.png';

const {width} = Dimensions.get('window');

const connectTypes = [
  {emoji: prof, title: 'Professional Connect'},
  {emoji: buss, title: 'Business Connect'},
  {emoji: tech, title: 'Technology Connect'},
  {emoji: love, title: 'Love Connect'},
  {emoji: frinds, title: 'Friendship Connect'},
  {emoji: faml, title: 'Family Connect'},
  {emoji: travl, title: 'Photography and Travel Connect'},
  {emoji: adva, title: 'Adventure Connect'},
  {emoji: sport, title: 'Sports Connect'},
  {emoji: food, title: 'Food Connect'},
  {emoji: life, title: 'Lifestyle Connect'},
  {emoji: mark, title: 'Marketplace Connect'},
  {emoji: enter, title: 'Entertainment Connect'},
  {emoji: skill, title: 'Skill-Based Connect'},
  {emoji: educ, title: 'Educational Connect'},
  {emoji: creat, title: 'Creative Connect'},
  {emoji: hobby, title: 'Hobby Connect'},
  {emoji: helth, title: 'Health and Wellness Connect'},
  {emoji: soil, title: 'Social Impact Connect'},
  {emoji: alum, title: 'Alumni Connect'},
  {emoji: scinc, title: 'Science Connect'},
  {emoji: fininc, title: 'Finance Connect'},
  {emoji: serv, title: 'Trade and Service Connect'},
  {emoji: event, title: 'Event Connect'},
  {emoji: explo, title: 'Explorer Connect'},
  {emoji: lega, title: 'Legal Connect'},
  {emoji: global, title: 'Global Connect'},
];

const ConnectTypesScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      // Update index first
      setCurrentIndex(prev =>
        prev === connectTypes.length - 1 ? 0 : prev + 1,
      );

      // Animate fade-out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        // Animate fade-in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, {opacity: fadeAnim}]}>
        <View style={styles.iconWrapper}>
          <Image
            source={connectTypes[currentIndex].emoji}
            style={styles.icon}
          />
        </View>
        <Text style={styles.titleText}>{connectTypes[currentIndex].title}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  card: {
    alignItems: 'center',
  },
  iconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  icon: {
    width: '85%',
    height: '85%',
    resizeMode: 'contain',
  },
  titleText: {
    marginTop: 8,
    color: 'white',
    fontSize: width * 0.04,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
});

export default ConnectTypesScreen;
