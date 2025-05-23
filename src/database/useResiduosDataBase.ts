import { useSQLiteContext } from 'expo-sqlite';
import {  useEffect } from "react";

export type ResiduosDataBase = {
    id : number
    data: string      
    categoria: string
    peso: string
    busca: string
}

export function useResiduosDataBase(){
    const dataBase = useSQLiteContext()

    // Executar ao iniciar para garantir que a coluna exista
    useEffect(() => {
        async function verificarColuna() {
            try {
                await dataBase.execAsync("ALTER TABLE residuos ADD COLUMN sincronizado INTEGER DEFAULT 0");
            } catch (error) {
                // Provavelmente a coluna já existe. Ignora erro.
            }
        }
        verificarColuna();
    }, []);

    async function create(data: Omit<ResiduosDataBase, "id">){
        const statement = await dataBase.prepareAsync(
            "insert into residuos(data,categoria,peso,sincronizado) values ($data,$categoria,$peso,0)"
        )

        try {
            const result = await statement.executeAsync({
                $data : data.data,
                $categoria : data.categoria,
                $peso: data.peso
            })

            const insertedRowId = result.lastInsertRowId.toLocaleString()
            return { insertedRowId }

        } catch (error) {
            throw error
        } finally {
            await statement.finalizeAsync()
        }
    }

    async function consultar(busca : string){
        try {
            const query = "select * from residuos where categoria like ? OR data like ?"
            const response = await dataBase.getAllAsync<ResiduosDataBase>(query,`%${busca}%`,`%${busca}%`)
            return response 
        } catch (error) {
            throw error
        }
    }

    async function consultarNaoSincronizados() {
        try {
            const query = "SELECT * FROM residuos WHERE sincronizado = 0";
            const response = await dataBase.getAllAsync<ResiduosDataBase>(query);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async function marcarComoSincronizado(id: number) {
        const statement = await dataBase.prepareAsync("UPDATE residuos SET sincronizado = 1 WHERE id = $id");
        try {
            await statement.executeAsync({ $id: id });
        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function remove(id: number){
        try {
            await dataBase.execAsync("Delete from residuos where id =" + id)
        } catch (error) {
            throw error
        }
    }

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
    }

    return {
        create,
        consultar,
        consultarNaoSincronizados,
        marcarComoSincronizado,
        remove,
        atualizar
    }
}
