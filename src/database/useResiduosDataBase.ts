import { Try } from 'expo-router/build/views/Try';
import { useSQLiteContext } from 'expo-sqlite';

export type ResiduosDataBase = {
    id : number
    data: string      
    categoria: string
    peso: string
    busca: string
}//criando o local de vaiáveis do Banco

export function useResiduosDataBase(){
    const dataBase = useSQLiteContext()//Acessar todos os metodos do bd

    async function create(data: Omit<ResiduosDataBase, "id">){
        const statement = await dataBase.prepareAsync(
            "insert into residuos(data,categoria,peso) values ($data,$categoria,$peso)"
        )

        try {
            const result = await statement.executeAsync({//executa o cadastro 
                $data : data.data,
                $categoria : data.categoria,
                $peso: data.peso
            })

            //coletando e devolvendo o ultimo id cadastrado
            const insertedRowId = result.lastInsertRowId.toLocaleString()
            return{insertedRowId}

        } catch (error) {
            throw error
        }finally{//finalizar o processo
            await statement.finalizeAsync()
        }
    }//fim da função

    async function consultar(busca :string ){
        try {
            const query = "select * from residuos where categoria  like ?  OR data like ? "//substituir por qualquer item de busca
            const response = await dataBase.getAllAsync<ResiduosDataBase>(query,`%${busca}%`,`%${busca}%`)
            return response 
        } catch (error) {
            throw error
        }
    }//fim do consultar


    async function remove(id:number){
        try {
            await dataBase.execAsync("Delete from residuos where id =" + id )
        } catch (error) {
            throw(error)
        }
    }//fim do remover
    
    async function atualizar(data: ResiduosDataBase){
        const statement = await dataBase.prepareAsync(
            "update residuos set data = $data, categoria = $categoria, peso = $peso where id = $id"
        )

        try{
            await statement.executeAsync({
                $id: data.id,
                $data: data.data,
                $categoria: data.categoria,
                $peso: data.peso
            })
        }catch(error){
            throw error
        }finally{
            await statement.finalizeAsync()
        }
    }//fim do atualizar

    
    return {create,consultar,remove,atualizar}
}//fim do create onde cria todos os métodos