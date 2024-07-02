import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, View, Text } from 'react-native';
import { useAppSelector } from '@/redux/exportTypes';
import ServiceCard from '@/components/ServiceCard';

export default function TabTwoScreen() {
  const user = useAppSelector(store => store?.user?.currentUser);
  // const { isValidate = false } = user;

  return (
    <View style={styles.exploreContainer}>
      <Text style={styles.serviceTitle}>-_-  Nos Services  -_-</Text>
      <View style={styles.exploreParent}>
        <ServiceCard title="Smart facture" name="newspaper" />
        <ServiceCard title="Smart facture" name="paper-plane" />
        <ServiceCard title="Smart facture" name="archive" />
        <ServiceCard title="Smart facture" name="chevron-collapse" />
        <ServiceCard title="Smart facture" name="contract" />
        <ServiceCard title="Smart facture" name="leaf" />
        <ServiceCard title="Smart facture" name="move" />
        <ServiceCard title="Smart facture" name="planet" />
        <ServiceCard title="Smart facture" name="qr-code" />
        <ServiceCard title="Smart facture" name="prism" />
        <ServiceCard title="Smart facture" name="terminal" />
        <ServiceCard title="Smart facture" name="server" />
        <ServiceCard title="Smart facture" name="stats-chart" />
        <ServiceCard title="Smart facture" name="library" />
      </View>
      {!user?.isValidate && (
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>
            Validate your account firstly to use our services
          </Text>
        </View>
      )}
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
  exploreContainer: {
    width: '100%',
    alignContent: 'center',
    justifyContent: 'center',
    flex: 1,
    flexWrap: 'wrap',
    padding: 40,
    paddingTop: 80,
  },
  exploreParent: {
    width: '100%',
    alignContent: 'center',
    justifyContent: 'flex-start',
    flex: 1,
    flexWrap: 'wrap',
    gap: 10,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
