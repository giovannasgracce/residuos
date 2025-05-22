import { View, Button, StyleSheet, TouchableOpacity, Text ,Image} from "react-native";
import { useNavigation } from "expo-router";

export default function Menu() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('Cadastrar')} // Cadastro
          >
            <Text style={styles.buttonText}>Cadastrar Residuos</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('Consultar2')}
          >
            <Text style={styles.buttonText}>Consultar Residuos</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('')} // Cadastro
          >
            <Text style={styles.buttonText}>Configuração Resíduos</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('')} // Cadastro
          >
            <Text style={styles.buttonText}>Sincronizar Residuos</Text>
          </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAFA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  button: {
    backgroundColor: '#93a267',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 22,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFAFA',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
