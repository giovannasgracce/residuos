import { type SQLiteDatabase } from "expo-sqlite";

export async function initializeDataBase(dataBase: SQLiteDatabase){
    await dataBase.execAsync(`
        CREATE TABLE IF NOT EXISTS residuos(
            id integer primary key autoincrement,
            data text not null,
            categoria text not null,
            peso real not null
        );
    `)
}