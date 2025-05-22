import { View, Button, StyleSheet, Alert, Platform, Text, TouchableOpacity } from "react-native";
import { Campo } from "@/components/Campo";
import { useState, useEffect } from "react";
import { ResiduosDataBase, useResiduosDataBase } from "@/database/useResiduosDataBase";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function Atualizar() {
  const [id, setId] = useState("");
  const [data, setData] = useState("");
  const [categoria, setCategoria] = useState("");
  const [peso, setPeso] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const residuosDb = useResiduosDataBase();
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params;

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
    if (item) {
      setId(item.id.toString());
      setData(item.data);
      setCategoria(item.categoria);
      setPeso(item.peso.toString());
    }
  }, []);

  function onChangeDate(event: any, selectedDate: Date) {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      const formato = selectedDate.toISOString().split("T")[0];
      setData(formato);
    }
  }

  async function atualizar() {
    try {
      await residuosDb.atualizar({
        id: Number(id),
        data,
        categoria,
        peso: parseFloat(peso),
      });

      Alert.alert("Sucesso!", "Dados do resíduo atualizados com sucesso", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Consultar"),
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  }

  async function salvarAtualizacao() {
    if (!categoria || !peso || !data) {
      Alert.alert("Preencha todos os campos!");
      return;
    }

    await atualizar();

    // limpar campos (opcional, já que vai navegar)
    setId("");
    setData("");
    setCategoria("");
    setPeso("");
  }

  return (
    <View style={styles.container}>
      {/* Campo de Data */}
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.dateInput}
      >
        <Text style={{ fontSize: 16 }}>{data || "Selecione a data"}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={data ? new Date(data) : new Date()}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      {/* Picker de Categoria */}
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

      {/* Campo de Peso */}
      <Campo
        placeholder="Peso (kg)"
        onChangeText={(text) => {
          const novo = text.replace(/[^0-9.]/g, "");
          const partes = novo.split(".");
          if (partes.length <= 2 && (partes.length === 1 || partes[1].length <= 2)) {
            setPeso(novo);
          }
        }}
        value={peso}
      />

      <Button title="Atualizar" onPress={salvarAtualizacao} />
      <Button title="Voltar" onPress={() => navigation.navigate("Consultar")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    backgroundColor: "#898989",
    alignItems: "center",
  },
  picker: {
    width: 300,
    height: 50,
    backgroundColor: "green",
    marginBottom: 20,
  },
  dateInput: {
    width: 300,
    height: 50,
    backgroundColor: "pink",
    justifyContent: "center",
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});
