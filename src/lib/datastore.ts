export interface Store {
  indices?: Array<DataStoreIndex>
  key: IDBObjectStoreParameters
  name: string
}

export interface DataStoreProps {
  database: string
  stores: Store[]
  version?: number
}

export interface DataStoreIndex {
  key: string | string[]
  name: string
  parameters?: IDBIndexParameters
}

export class DataStore implements DataStoreProps {
  constructor (props: DataStoreProps) {
    this.database = props.database
    this.stores = props.stores
    this.version = props.version || 1
  }
  public static support (): boolean {
    return !!window.indexedDB
  }
  public async connect (): Promise<void> {
    if (!DataStore.support()) {
      throw new Error('IndexedDB not supported')
    }
    if (this.db) {
      return
    }
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.database, this.version)
      request.onupgradeneeded = () => {
        this.upgrade(request.result)
      }
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }
      request.onerror = (err) => {
        this.db = undefined
        reject(err)
      }
    })
  }
  public async get <T> (store_name: string, id: IDBValidKey): Promise<T> {
    return new Promise((resolve, reject) => {
      const store = this.store(store_name, 'readonly')
      const request = store.get(id)
      request.onsuccess = () => {
        resolve(request.result)
      }
      request.onerror = (err) => {
        reject(err)
      }
    })
  }
  public async all <T> (store_name: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const store = this.store(store_name, 'readonly')
      const request = store.getAll()
      request.onsuccess = () => {
        resolve(request.result)
      }
      request.onerror = (err) => {
        reject(err)
      }
    })
  }
  public async add <T> (store_name: string, doc: T): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.store(store_name, 'readwrite')
      const request = store.add(doc)
      request.onsuccess = () => {
        resolve()
      }
      request.onerror = (err) => {
        reject(err)
      }
    })
  }
  public async update <T> (store_name: string, doc: T): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.store(store_name, 'readwrite')
      const request = store.put(doc)
      request.onsuccess = () => {
        resolve()
      }
      request.onerror = (err) => {
        reject(err)
      }
    })
  }
  public async delete (store_name: string, id: IDBValidKey): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.store(store_name, 'readwrite')
      const request = store.delete(id)
      request.onsuccess = () => {
        resolve()
      }
      request.onerror = (err) => {
        console.error('DataStore', err)
        reject(err)
      }
    })
  }
  private connection (): IDBDatabase {
    if (!this.db) {
      throw new Error('Connection not found')
    }
    return this.db
  }
  private upgrade (db: IDBDatabase): void {
    this.stores.forEach((store) => {
      if (db.objectStoreNames.contains(store.name)) {
        return
      }
      const obj = db.createObjectStore(store.name, store.key)
      if (!store.indices) {
        return
      }
      for (const { key, name, parameters } of store.indices) {
        obj.createIndex(name, key, parameters)
      }
    })
  }
  private transaction (store_name: string, mode: IDBTransactionMode): IDBTransaction {
    return this.connection().transaction(store_name, mode)
  }
  private store (store_name: string, mode: IDBTransactionMode): IDBObjectStore {
    const transaction = this.transaction(store_name, mode)
    return transaction.objectStore(store_name)
  }
  public readonly database: string
  public readonly stores: Store[]
  public readonly version: number
  private db?: IDBDatabase
}
