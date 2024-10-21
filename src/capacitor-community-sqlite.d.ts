declare module '@capacitor-community/sqlite' {
  export class SQLiteConnection {
    createConnection(arg0: string, arg1: boolean, arg2: string, arg3: number): any {
      throw new Error('Method not implemented.');
    }
    constructor(sqlite: any);
    open(databaseName: string): Promise<void>;
    execute(query: string, values?: any[]): Promise<any>;
    run(query: string, values?: any[]): Promise<void>;
    query(query: string, values?: any[]): Promise<any>;
    close(): Promise<void>;
  }
  
  export const CapacitorSQLite: any;
}
