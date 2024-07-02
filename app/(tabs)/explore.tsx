import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, View, Text } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ServiceCard from '@/components/ServiceCard';
import { useAppSelector } from '@/redux/exportTypes';

export default function TabTwoScreen() {
  const user=useAppSelector(store => store.user.currentUser)
  const {isValidate} = user
  return (
    <View style={styles.exploreContainer}>
      <Text style={styles.serviceTitle}>-_-  Nos Services  -_-</Text>
      <View style={styles.exploreParent}>
      <ServiceCard title="Smart facture" name="newspaper"/>
      <ServiceCard title="Smart facture" name="paper-plane"/>
      <ServiceCard title="Smart facture" name="archive"/>
      <ServiceCard title="Smart facture" name="chevron-collapse"/>
      <ServiceCard title="Smart facture" name="contract"/>
      <ServiceCard title="Smart facture" name="leaf"/>
      <ServiceCard title="Smart facture" name="move"/>
      <ServiceCard title="Smart facture" name="planet"/>
      <ServiceCard title="Smart facture" name="qr-code"/>
      <ServiceCard title="Smart facture" name="prism"/>
      <ServiceCard title="Smart facture" name="terminal"/>
      <ServiceCard title="Smart facture" name="server"/>
      <ServiceCard title="Smart facture" name="stats-chart"/>
      <ServiceCard title="Smart facture" name="library"/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  exploreContainer:{
    width:"100%",
    alignContent: "center",
    justifyContent: "center",
    flex:1,
    flexWrap:"wrap",
    padding:40,
    paddingTop:80,
  },
  exploreParent:{
    width:"100%",
    alignContent: "center",
    justifyContent: "flex-start",
    flex:1,
    flexWrap:"wrap",
    gap:10,
  },
  serviceTitle:{
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: 10,
    // width: '100%',
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    // marginBottom: 20,
    // marginTop: 20,
    // borderRadius: 80,
    // borderWidth: 1,
    // borderColor: '#333',
    // backgroundColor: '#03726C',
  }
});
