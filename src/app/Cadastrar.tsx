import { View, Button, StyleSheet, Alert, Platform, Text, TouchableOpacity } from "react-native";
import { Campo } from "@/components/Campo";
import { useState, useEffect } from "react";
import { ResiduosDataBase, useResiduosDataBase } from "@/database/useResiduosDataBase";
import { useNavigation } from "expo-router";
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons'; // para o ícone da seta


export default function Index() {
  const [id, setId] = useState("");
  const [data, setData] = useState("");
  const [categoria, setCategoria] = useState("");
  const [peso, setPeso] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const ResiduosDataBase = useResiduosDataBase();
  const navigation = useNavigation();

  const categorias = [
    "Não reciclável",
    "Reciclável",
    "Óleo",
    "Tampinhas plásticas",
    "Lacres de alumínio",
    "Tecidos",
    "Meias",
    "Material de escrita",
    "Esponjas",
    "Eletrônicos",
    "Pilhas e baterias",
    "Infectante",
    "Químicos",
    "Lâmpada fluorescente",
    "Tonners de impressora",
    "Esmaltes",
    "Cosméticos",
    "Cartela de medicamento",
  ];

  useEffect(() => {
    const hoje = new Date();
    const formato = hoje.toISOString().split("T")[0]; // yyyy-mm-dd
    setData(formato);
  }, []);

  function onChangeDate(event: any, selectedDate: Date) {
    setShowDatePicker(Platform.OS === "ios"); //  fecha o picker após escolher
    if (selectedDate) {
      const formato = selectedDate.toISOString().split("T")[0];
      setData(formato);
    }
  }

  async function create() {
    try {
      const response = await ResiduosDataBase.create({
        data,
        categoria,
        peso,
      });

      Alert.alert("Resíduo cadastrado com sucesso! ID:" + response.insertedRowId);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      
      {/* Topo com seta e título centralizado */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Index")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#93a267" />
        </TouchableOpacity>
        <Text style={styles.titulo}>CADASTRO</Text>
      </View>
      
      {/* Calendário */}
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.dateInput}
      >
        <Text style={{ fontSize: 16, color: "#FFFAFA" }}>{data || "Selecione a data"}</Text>
      </TouchableOpacity>
  
      {showDatePicker && (
        <DateTimePicker
          value={data ? new Date(data) : new Date()}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}
  
      {/* Picker */}
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={categoria}
          onValueChange={(itemValue) => setCategoria(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecione a categoria" value="" />
          {categorias.map((cat, index) => (
            <Picker.Item key={index} label={cat} value={cat} />
          ))}
        </Picker>
      </View>
  
      {/* Campo peso */}
      <Campo
        placeholder="Peso (kg)"
        onChangeText={(text) => {
          const novo = text.replace(/[^0-9.]/g, "");
          const partes = novo.split(".");
          if (partes.length <= 2) {
            if (partes.length === 1 || partes[1].length <= 2) {
              setPeso(novo);
            }
          }
        }}
        value={peso}
      />
  
      {/* Botões */}
      <View style={styles.teste}>
      <TouchableOpacity style={styles.botao} onPress={create}>
        <Text style={styles.textoBotao}>Cadastrar</Text>
      </TouchableOpacity>
  
      <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate("Consultar")}>
        <Text style={styles.textoBotao}>Consultar</Text>
      </TouchableOpacity>
      </View>
     
    </View>
  );
}  

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f4d6",
    alignItems: "center",
    paddingTop: 250, 
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingVertical: 20,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 5,
    // sombra leve para destacar a seta
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
    borderRadius: 30,
    backgroundColor: "#e0e6d4",
  },
  titulo: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#93a267',
    marginTop: 100, 
  },
  dateInput: {
    width: 300,
    height: 50,
    backgroundColor: "#93a267",
    justifyContent: "center",
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 22,
  },
  pickerWrapper: {
    width: 300,
    height: 50,
    backgroundColor: "#93a267",
    borderRadius: 22,
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    width: 300,
    height: 50,
    color: "#FFFAFA",
  },
  botao: {
    backgroundColor: '#556B2F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginVertical: 8,
    alignItems: 'center',
    width: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  textoBotao: {
    color: '#FFFAFA',
    fontSize: 16,
    fontWeight: 'bold',
  },

  teste: {
    marginTop: 20,
  }
});
