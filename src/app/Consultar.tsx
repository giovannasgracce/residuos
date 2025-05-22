import { View, Button, StyleSheet, Alert,FlatList} from "react-native"
import {Campo} from "@/components/Campo"
import {useState,useEffect} from 'react'
import { ResiduosDataBase, useResiduosDataBase } from "@/database/useResiduosDataBase"
import { useNavigation } from "expo-router"
import {Residuos} from '@/components/Residuos'


 
export default function Index(){
    const [id, setId] = useState("")
    const [data, setData] = useState("")
    const [categoria, setCategoria] = useState("")
    const [peso, setPeso] = useState("")
    const [residuos, setResiduos] = useState<ResiduosDataBase[]>()
    const ResiduosDataBase = useResiduosDataBase()
    const navigation = useNavigation()
    const [busca,setBusca] = useState("")
    
    async function list(){
        try {
            const response = await ResiduosDataBase.consultar(busca)
            setResiduos(response)
        } catch (error) {
            console.log(error)
        }
    }//fim do listar
    
    async function details(item:ResiduosDataBase){
        setId(String(item.id))
        setData(item.data)
        setCategoria(item.categoria)
        setPeso(item.peso)
    }//detalha as estrutura de consulta

    async function remove(id:number){
      try{
          await ResiduosDataBase.remove(id)
          await list()
      }catch(error){
        console.log(error)
      }   
    }//fim da função remover



    //carregar a lista do banco
    useEffect(() => {list()},[busca])
    return (
        <View style={styles.container}>
            <Campo placeholder="Pesquisar" onChangeText={setBusca} />
            <View style={styles.flat}>
                <FlatList
                    data = {residuos}
                    keyExtractor={(item)=>String(item.id)}
                    renderItem ={({item}) => <Residuos data={item} onDelete={() => remove(item.id)} onEditar={()=> navigation.navigate('Atualizar',{item})}/>}
                    contentContainerStyle={{gap:16}}
                />
            </View>
       
        <Button title="Voltar" onPress={() => navigation.navigate('Cadastrar')}/>
    </View>

    );
}  
 
const styles = StyleSheet.create({
        container: {
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            backgroundColor: '#898989',
            alignItems: "center",
            marginTop: 25,
        },

        flat: {
            width: '100%',
            height: '50%',
            padding: 10,
            backgroundColor: "#93a267",
        },
    }
);