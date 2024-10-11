declare module 'capacitor-community/sqlite' {
  export const CapacitorSQLite: any;
  export class SQLiteConnection {
    constructor(capacitorSQLite: any);
    open(dbName: string): Promise<void>;
    execute(query: string, values?: any[]): Promise<any>;
    query(query: string, values?: any[]): Promise<any>;
  }
}
