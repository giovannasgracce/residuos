import { PressableProps, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";

type Props = PressableProps & {
  data: {
    id: number;
    data: string;
    categoria: string;
    peso: string;
  };
  onDelete: () => void;
  onEditar: () => void;
};

export function Residuos({ data, onDelete, onEditar, ...rest }: Props) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.fundo} {...rest}>
        <Text style={styles.texto}>
          {data.id} - {data.data} - {data.categoria} - {data.peso}
        </Text>

        <View style={styles.icones}>
          <TouchableOpacity onPress={onEditar}>
            <MaterialIcons name="edit" size={22} color="#325c32" />
          </TouchableOpacity>

          <TouchableOpacity onPress={onDelete}>
            <MaterialIcons name="delete" size={22} color="#a03232" />
          </TouchableOpacity>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  fundo: {
    width: "100%",
    backgroundColor: "#e0e6d4", 
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  texto: {
    flex: 1,
    color: "#333",
    fontSize: 14,
  },
  icones: {
    flexDirection: "row",
    gap: 12,
  },
});
