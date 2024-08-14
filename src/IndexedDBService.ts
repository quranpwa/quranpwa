export class IndexedDBService<T> {
    private dbName: string;
    private allStoreNames: string[];
    private storeName: string;

    constructor(dbName: string, storeName: string, allStoreNames?: string[]) {
        this.dbName = dbName;
        this.storeName = storeName;
        this.allStoreNames = allStoreNames ?? [storeName];
    }

    private openDatabase(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName);

            request.onerror = (event) => {
                reject(`Database error: ${(event.target as IDBOpenDBRequest).error?.message}`);
            };

            request.onsuccess = (event) => {
                resolve((event.target as IDBOpenDBRequest).result);
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                this.allStoreNames.forEach(storeName => {
                    if (!db.objectStoreNames.contains(storeName)) {
                        db.createObjectStore(storeName, { keyPath: 'id' });
                    }
                });
            };
        });
    }

    public storeData(data: T, key?: IDBValidKey): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const db = await this.openDatabase();
                const transaction = db.transaction([this.storeName], 'readwrite');
                const objectStore = transaction.objectStore(this.storeName);

                const request = key ? objectStore.put(data, key) : objectStore.add(data);

                request.onerror = (event) => {
                    reject(`Add/Put error: ${(event.target as IDBRequest).error?.message}`);
                };

                request.onsuccess = () => {
                    resolve();
                };
            } catch (error) {
                reject(`Transaction error: ${error}`);
            }
        });
    }

    public getData(key: IDBValidKey): Promise<T | undefined> {
        return new Promise(async (resolve, reject) => {
            try {
                const db = await this.openDatabase();
                const transaction = db.transaction([this.storeName], 'readonly');
                const objectStore = transaction.objectStore(this.storeName);

                const request = objectStore.get(key);

                request.onerror = (event) => {
                    reject(`Get error: ${(event.target as IDBRequest).error?.message}`);
                };

                request.onsuccess = (event) => {
                    resolve((event.target as IDBRequest).result as T | undefined);
                };
            } catch (error) {
                reject(`Transaction error: ${error}`);
            }
        });
    }

    public getAllData(): Promise<T[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const db = await this.openDatabase();
                const transaction = db.transaction([this.storeName], 'readonly');
                const objectStore = transaction.objectStore(this.storeName);

                const request = objectStore.getAll();

                request.onerror = (event) => {
                    reject(`GetAll error: ${(event.target as IDBRequest).error?.message}`);
                };

                request.onsuccess = (event) => {
                    resolve((event.target as IDBRequest).result as T[]);
                };
            } catch (error) {
                reject(`Transaction error: ${error}`);
            }
        });
    }

    public getAllKeys(): Promise<number[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const db = await this.openDatabase();
                const transaction = db.transaction([this.storeName], 'readonly');
                const objectStore = transaction.objectStore(this.storeName);

                const request = objectStore.getAllKeys();

                request.onerror = (event) => {
                    reject(`GetAllKeys error: ${(event.target as IDBRequest).error?.message}`);
                };

                request.onsuccess = (event) => {
                    resolve((event.target as IDBRequest).result as number[]);
                };
            } catch (error) {
                reject(`Transaction error: ${error}`);
            }
        });
    }

    public exists(key: IDBValidKey): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {
                const db = await this.openDatabase();
                const transaction = db.transaction([this.storeName], 'readonly');
                const objectStore = transaction.objectStore(this.storeName);

                const request = objectStore.get(key);

                request.onerror = (event) => {
                    reject(`Existency check error: ${(event.target as IDBRequest).error?.message}`);
                };

                request.onsuccess = (event) => {
                    resolve((event.target as IDBRequest).result !== undefined);
                };
            } catch (error) {
                reject(`Transaction error: ${error}`);
            }
        });
    }
}

/*
// Usage example
interface MyDataType {
    id?: number;
    name: string;
    value: string;
}

const dbService = new IndexedDBService<MyDataType>('myDatabase', 'myObjectStore');

// Store data
const myData: MyDataType = { name: "exampleName", value: "exampleValue" };
dbService.storeData(myData)
    .then(() => console.log('Data stored successfully'))
    .catch(error => console.error('Error storing data:', error));

// Get data
dbService.getData(1)
    .then(data => {
        if (data) {
            console.log('Data retrieved:', data);
        } else {
            console.log('No data found for the provided key.');
        }
    })
    .catch(error => console.error('Error retrieving data:', error));

// Get all data
dbService.getAllData()
    .then(allData => console.log('All data retrieved:', allData))
    .catch(error => console.error('Error retrieving all data:', error));

// Check if data exists
dbService.exists(1)
    .then(exists => {
        if (exists) {
            console.log('Data exists for the provided key.');
        } else {
            console.log('No data exists for the provided key.');
        }
    })
    .catch(error => console.error('Error checking existency:', error));
*/