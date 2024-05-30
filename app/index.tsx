import {StyleSheet, View,} from 'react-native';
import Home from '@/components/Users/index';



export default function HomeScreen() {

  return (
    <View style={styles.container}>
          <Home />
    </View> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#fff',
    
  },
  titleContainer: {

  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
