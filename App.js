import Index from './app/index';

// app/index.jsx
export const metadata = {
    title: 'Find Parking', // This will set the header title
  };
  
  export default function Index() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Home screen content</Text>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      // other styles...
    },
    text: {
      // styles for your content text
    },
  });
  