import { View, Image, ImageProps, StyleSheet } from "react-native";

export function Imagem({...rest}:ImageProps){
    return (
        <Image style={styles.img} {...rest}/>
    );
}

const styles = StyleSheet.create({
    img:{
        width: 150,
        height: 150,
        borderRadius: 5, 
        justifyContent: "center",
        alignItems:"center",
        marginTop:5,
    },
});