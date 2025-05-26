import { View, Button, StyleSheet, FlatList,ScrollView  } from "react-native";
import { Campo } from "@/components/Campo";
import { useState, useEffect } from "react";
import { useResiduosDataBase } from "@/database/useResiduosDataBase";
import { useNavigation } from "expo-router";
import { Residuos } from "@/components/Residuos";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Index() {
  const [id, setId] = useState("");
  const [data, setData] = useState("");
  const [categoria, setCategoria] = useState("");
  const [peso, setPeso] = useState("");
  const [residuos, setResiduos] = useState([]);
  const residuosDb = useResiduosDataBase();
  const navigation = useNavigation();
  const [busca, setBusca] = useState("");

  async function list() {
    try {
      const response = await residuosDb.consultar(busca);
      setResiduos(response);
    } catch (error) {
      console.log(error);
    }
  } // fim do listar

  async function remove(id: number) {
    try {
      await residuosDb.remove(id);
      await list();
    } catch (error) {
      console.log(error);
    }
  } // fim da função remover

  // carregar a lista do banco
  useEffect(() => {list();}, [busca]);

  return (
    <View style={styles.container}>
    
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Index")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#93a267" />
        </TouchableOpacity>
      </View>

      <View style={styles.campoBusca}>
        <Ionicons name="search" size={35} color="#666" style={styles.iconeBusca} />
        <Campo
            placeholder="Pesquisar"
            placeholderTextColor="#666"
            onChangeText={setBusca}
            style={styles.inputBusca}
        />
      </View>


   
      <View style={styles.flat}>
      <ScrollView contentContainerStyle={{ gap: 16, paddingVertical: 10 }}>
        {residuos.map((item) => (
          <Residuos
            key={item.id}
            data={item}
            onDelete={() => remove(item.id)}
            onEditar={() => navigation.navigate("Atualizar2", { item })}
          />
        ))}
      </ScrollView>
    </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4d6",
    paddingTop: 50,
    alignItems: "center",
  },
  header: {
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 6,
    borderRadius: 30,
    backgroundColor: "#e0e6d4",
    // sombra leve para destacar a seta
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  campo: {
    width: "90%",
    marginBottom: 15,
  },
  flat: {
    width: "90%",
    height: 600, 
    backgroundColor: "#93a267",
    borderRadius: 22,
    paddingHorizontal: 2,
    paddingVertical: 8,
  },
  
  campoBusca: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0e6d4",
    borderRadius: 12,
    paddingHorizontal: 10,
    width: "90%",
    marginBottom: 15,
  },
  iconeBusca: {
    marginRight: 8,
  },
  inputBusca: {
    flex: 1,
    color: "#333",
    height: 40,
  },

});
