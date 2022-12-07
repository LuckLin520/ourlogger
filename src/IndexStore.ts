/*
 * @Author: 赵治林
 * @Description: "indexDB操作类"
 * @Date: 2022-11-14 15:50:25
 * @Last Modified by: 赵治林
 * @Last Modified time: 2022-11-18 14:23:22
 */
import { sleep } from './util'

type Row = { id: string; content: string } | undefined

class IndexStore {
  private dbName = 'Logger'

  private version = 1

  private storeName = 'Logger'

  private request: IDBOpenDBRequest

  private db: IDBDatabase | undefined

  constructor() {
    this.request = indexedDB.open(this.dbName, this.version)
    this.init()
  }

  private init(): void {
    this.request.onsuccess = (event: any) => {
      this.db = event.target.result
    }

    this.request.onupgradeneeded = (event: any) => {
      this.db = event.target.result
      if (!this.db!.objectStoreNames.contains(this.storeName)) {
        this.db!.createObjectStore(this.storeName, { keyPath: 'id' })
      }
    }
  }

  public async get(key: string): Promise<Row> {
    await sleep()
    const transaction = this.db!.transaction([this.storeName])
    const objectStore = transaction.objectStore(this.storeName)
    const request = objectStore.get(key)
    return new Promise(rs => {
      request.onsuccess = function () {
        rs(request.result)
      }
    })
  }

  public async add(row: Row) {
    await sleep()
    const request = this.db!.transaction([this.storeName], 'readwrite')
      .objectStore(this.storeName)
      .add(row)

    request.onerror = function (event: any) {
      throw new Error(event.target.error)
    }
  }

  public async put(row: Row) {
    await sleep()
    const request = this.db!.transaction([this.storeName], 'readwrite')
      .objectStore(this.storeName)
      .put(row)

    request.onerror = function (event: any) {
      throw new Error(event.target.error)
    }
  }

  public async delete(key: string) {
    await sleep()
    this.db!.transaction([this.storeName], 'readwrite')
      .objectStore(this.storeName)
      .delete(key)
  }
}

export default IndexStore
