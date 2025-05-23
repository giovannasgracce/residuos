import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';

export function Campo({ ...rest }: TextInputProps) {
  return (
    <View>
      <TextInput
        style={styles.cmp}
        placeholderTextColor="#FFFAFA"
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cmp: {
    width: 300,
    fontSize: 16,
    borderRadius: 20,
    backgroundColor: "#93a267",
    color: "#FFFAFA", // cor do texto digitado
    margin: 10,
    padding: 12,
    textAlign: 'center',
  },
});
