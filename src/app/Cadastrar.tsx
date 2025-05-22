import { View, Button, StyleSheet, Alert, Platform, Text, TouchableOpacity } from "react-native";
import { Campo } from "@/components/Campo";
import { useState, useEffect } from "react";
import { ResiduosDataBase, useResiduosDataBase } from "@/database/useResiduosDataBase";
import { useNavigation } from "expo-router";
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

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
      
      {/* Botão para abrir o calendário */}
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.dateInput}
      >
        <Text style={{ fontSize: 16, color: "#FFFAFA"  }}>{data || "Selecione a data"}</Text>
      </TouchableOpacity>

      {/* calendario aparece quando showDatePicker é true */}
      {showDatePicker && (
        <DateTimePicker
          value={data ? new Date(data) : new Date()}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

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
      <TouchableOpacity style={styles.botao} onPress={create}>
        <Text style={styles.textoBotao}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate("Consultar")}>
        <Text style={styles.textoBotao}>Consultar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate("Index")}>
        <Text style={styles.textoBotao}>Voltar</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    backgroundColor: "#FFFAFA",
    alignItems: "center",
  },
  picker: {
    width: 300,
    height: 50,
    backgroundColor: "#93a267",
    marginBottom: 20,
    borderRadius: 22 ,
    color: "#FFFAFA",
  },
  pickerWrapper: {
    width: 300,
    height: 50,
    backgroundColor: "#93a267",
    borderRadius: 22,
    marginBottom: 20,
    overflow: 'hidden',  // importante para o borderRadius funcionar no Android
    color: "#FFFAFA",
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
  botao: {
    backgroundColor: '#93a267',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 50,
    marginVertical: 10,
    alignItems: 'center',
    width: 300,
  },
  
  textoBotao: {
    color: '#FFFAFA',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
});
