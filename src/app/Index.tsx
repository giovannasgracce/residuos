import { View, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { useNavigation } from "expo-router";
import { useState, useEffect } from "react";
import { useResiduosDataBase, ResiduosDataBase } from "@/database/useResiduosDataBase";

export default function Menu() {
  const navigation = useNavigation();
  const { consultar, consultarNaoSincronizados, marcarComoSincronizado } = useResiduosDataBase();
  const [residuos, setResiduos] = useState<ResiduosDataBase[]>([]);
  const [id, setId] = useState("");
  const [data, setData] = useState("");
  const [categoria, setCategoria] = useState("");
  const [peso, setPeso] = useState("");


  const URL = "https://api.sheetbest.com/sheets/89d19c80-5229-4624-a4ce-7b41a1ce5f95";

  useEffect(() => {
    async function carregarResiduos() {
      try {
        const dados = await consultar("");
        setResiduos(dados);
      } catch (error) {
        Alert.alert("Erro", "Falha ao carregar resíduos do banco local");
      }
    }
    carregarResiduos();
  }, []);

  async function sincronizarComPlanilha() {
    try {
      const naoSincronizados = await consultarNaoSincronizados();

      for (const item of naoSincronizados) {
        await fetch(URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: item.id,
            data: item.data,
            categoria: item.categoria,
            peso: item.peso,
          }),
        });

        await marcarComoSincronizado(item.id);
      }

      Alert.alert("Sucesso", "Resíduos sincronizados com a planilha!");
    } catch (error) {
      Alert.alert("Erro", "Algo deu errado ao sincronizar.");
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Cadastrar')}>
        <Text style={styles.buttonText}>Cadastrar Resíduos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Consultar2')}>
        <Text style={styles.buttonText}>Consultar Resíduos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('')}>
        <Text style={styles.buttonText}>Configuração Resíduos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={sincronizarComPlanilha}>
        <Text style={styles.buttonText}>Sincronizar Resíduos</Text>
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
