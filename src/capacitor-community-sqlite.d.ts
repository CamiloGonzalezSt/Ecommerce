declare module '@capacitor-community/sqlite' {
  export class SQLiteConnection {
    constructor(sqlite: any);
    open(databaseName: string): Promise<void>;
    execute(query: string, values?: any[]): Promise<any>;
    run(query: string, values?: any[]): Promise<void>;
    query(query: string, values?: any[]): Promise<any>;
    close(): Promise<void>;
  }
  
  export const CapacitorSQLite: any;
}
