import { PressableProps,Pressable,StyleSheet,Text, TouchableOpacity,View} from 'react-native'
import {MaterialIcons} from "@expo/vector-icons"


type Props = PressableProps & {
    data:{
        id : number
        data: string      
        categoria: string
        peso: string
    }
    onDelete: ()=> void
    onEditar: ()=> void

}//instacia de variavel


export function Residuos({data,  onDelete, onEditar ,...rest}: Props){
    return(
        <View style={styles.container}>
            <Pressable style={styles.fundo} {...rest}>
                <Text style={styles.texto} >
                    {data.id} - {data.data} - {data.categoria} - {data.peso}
                </Text>

                <TouchableOpacity onPress={onEditar}>
                    <MaterialIcons name="edit" size ={24} color="#3232aa"/>
                </TouchableOpacity>

                <TouchableOpacity onPress={onDelete}>
                    <MaterialIcons name="delete" size ={24} color="red"/>
                </TouchableOpacity>
             </Pressable>  
        </View>
    );
}

const styles = StyleSheet.create({  
    container:{
        justifyContent:"center",
        marginLeft:20,
        marginRight:50,
    },
    fundo:{
        width:"80%",
        backgroundColor:"#cecece",
        padding:24,
        borderRadius:5,
        gap:12,
        marginTop:10,
        flexDirection: "row",
    },
    texto:{
        flex:1,
    },
});