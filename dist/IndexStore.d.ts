type Row = {
    id: string;
    content: string;
} | undefined;
declare class IndexStore {
    private dbName;
    private version;
    private storeName;
    private request;
    private db;
    constructor();
    private init;
    get(key: string): Promise<Row>;
    add(row: Row): Promise<void>;
    put(row: Row): Promise<void>;
    delete(key: string): Promise<void>;
}
export default IndexStore;
