
import SQLite from 'react-native-sqlite-storage'

export class BaseManager {

    constructor() {
        this.sqlite = SQLite;
        this.sqlite.DEBUG(true);
        this.sqlite.enablePromise(true);
        this.sqlite.openDatabase({
            name: "WavesDB111",
            location: "default"
        }).then((db) => {
            this.dbInstance = db;
        }).catch((error) => {
            console.log(error)
        })
    }

    /////////////////  play list table   ///////////////

    createPlaylistTable() {
        return new Promise((resolve, reject) => {
            this.dbInstance.executeSql(
                "CREATE TABLE IF NOT EXISTS Playlist_Table (id INTEGER PRIMARY KEY NOT NULL, title TEXT, pic_path TEXT);"
            ).then((values) => {
                console.log("create table success");
                resolve(true);
                
            }).catch((err) => {
                console.log("create fail  " + err.message)
                reject(false)
                
            })
        })
    }

    addPlaylistToTable(title, pic_path) {
        return new Promise((resolve, reject) => {
            this.dbInstance.executeSql(
                "INSERT INTO Playlist_Table (title, pic_path) VALUES (?, ?)", [title, pic_path]
            ).then((values) => {
                resolve(true)
                console.log("add success" + title + ":::::" + pic_path)
            }).catch((err) => {
                reject(false)
                console.log("add fail  " + err.message)
            })
        })
    }

    removePlaylistFromTable(id) {
        return new Promise((resolve, reject) => {
            this.dbInstance.executeSql(
                "DELETE FROM Playlist_Table WHERE id = (?)", [id]
            ).then((values) => {
                resolve(true)
            }).catch((err) => {
                reject(false)
            })
        })
    }

    getAllPlaylists() {
        return new Promise((resolve, reject) => {
            this.dbInstance.executeSql(
                "SELECT * FROM Playlist_Table"
            ).then(([values]) => {
                var array = [];
                for(let index = 0; index < values.rows.length; index ++) {
                    const element = values.rows.item(index);
                    array.push(element);
                }
                resolve(array)
            }).catch((err) => {
                reject(false)
                console.log("get fail  " + err.message)
            })
        })
    }


    /////////////////  song table   ////////////////
    createSongTable() {
        return new Promise((resolve, reject) => {
            this.dbInstance.executeSql(
                "CREATE TABLE IF NOT EXISTS Song_Table (id INTEGER PRIMARY KEY NOT NULL, title TEXT, artist TEXT, url TEXT, artwork TEXT, song_id TEXT, playlist_id TEXT);"
            ).then((values) => {
                resolve(true)
            }).catch((err) => {
                reject(false)
            })
        })
    }

    addSongToTable(title, artist, url, artwork, song_id, playlist_id) {
        return new Promise((resolve, reject) => {
            this.dbInstance.executeSql(
                "INSERT INTO Song_Table (title, artist, url, artwork, song_id, playlist_id) VALUES(?, ?, ?, ?, ?, ?)", [title, artist, url, artwork, song_id, playlist_id]
            ).then((values) => {
                resolve(true)
            }).catch((err) => {
                reject(false)
            })
        })
    }

    updateSongFromTable(song_id, playlist_id) {
        return new Promise((resolve, reject) => {
            this.dbInstance.executeSql(
                "UPDATE Song_Table SET playlist_id = ? WHERE song_id = ?", [playlist_id, song_id]
            ).then((values) => {
                resolve(true)
            }).catch((err) => {
                reject(false)
            })
        })
    }

    removeSongFromTable(id) {
        return new Promise((resolve, reject) => {
            this.dbInstance.executeSql(
                "DELETE FROM Song_Table WHERE id = ?", [id]
            ).then((values) => {
                resolve(true)
            }).catch((err) => {
                reject(false)
            })
        })
    }

    getSong(song_id) {
        return new Promise((resolve, reject) => {
            this.dbInstance.executeSql(
                "SELECT * FROM Song_Table WHERE song_id = (?)", [song_id]
            ).then(([values]) => {
                var array = [];
                for(let index = 0; index < values.rows.length; index ++) {
                    const element = values.rows.item(index);
                    array.push(element);
                }
                resolve(array)
            }).catch((err) => {
                console.log("44444444:" + err)
                reject(err)
            })
        })
    }

    getAllSongs() {
        return new Promise((resolve, reject) => {
            this.dbInstance.executeSql(
                "SELECT * FROM Song_Table"
            ).then(([values]) => {
                var array = [];
                for(let index = 0; index < values.rows.length; index ++) {
                    const element = values.rows.item(index);
                    array.push(element);
                }
                resolve(array)
            }).catch((err) => {
                
                reject(false)
            })
        })
    }

    getPlaylistSongs(playlist_id) {
        return new Promise((resolve, reject) => {
            this.dbInstance.executeSql(
                "SELECT * FROM Song_Table WHERE playlist_id = ?", [playlist_id]
            ).then(([values]) => {
                var array = [];
                for(let index = 0; index < values.rows.length; index ++) {
                    const element = values.rows.item(index);
                    array.push(element);
                }
                resolve(array)
            }).catch((err) => {
                reject(false)
            })
        })
    }

}