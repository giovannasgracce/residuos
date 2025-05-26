import { View, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { useNavigation } from "expo-router";
import { Imagem } from "@/components/Imagem";
import { useState, useEffect } from "react";
import residuosImage from "../../assets/images/residuos.png";
import { useResiduosDataBase, ResiduosDataBase } from "@/database/useResiduosDataBase";

export default function Menu() {
  const navigation = useNavigation();
  const { consultar, consultarNaoSincronizados, marcarComoSincronizado } = useResiduosDataBase();
  const [residuos, setResiduos] = useState<ResiduosDataBase[]>([]);

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
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": "x$p9J#C8VDUxO!trUWkcJ4f8BC$MNbgNnSJ8V8ENzAYYRlp-m8dHGw6WM0rHSHWk",
          },
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
      <View style={styles.imagemContainer}>
        <Imagem source={residuosImage} style={styles.img} />
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Cadastrar")}>
          <Text style={styles.buttonText}>Cadastrar Resíduos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Consultar2")}>
          <Text style={styles.buttonText}>Consultar Resíduos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={sincronizarComPlanilha}>
          <Text style={styles.buttonText}>Sincronizar Resíduos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4d6",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 180,
    paddingHorizontal: 20,
  },

  imagemContainer: {
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  img: {
    width: 150,
    height: 150,
    borderRadius: 5,
  },

  content: {
    width: "100%",
    alignItems: "center",
  },

  button: {
    backgroundColor: "#93a267",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 22,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFAFA",
    fontSize: 18,
    fontWeight: "bold",
  },
});
