package db

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func InitDB() {
	var err error
	DB, err = sql.Open("postgres", os.Getenv("DB_URL"))
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	if err := DB.Ping(); err != nil {
		log.Fatal("DB unreachable:", err)
	}

    // Create tables if they do not exist
    _, err = DB.Exec(`
        CREATE TABLE IF NOT EXISTS liked_movies (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            media_type TEXT NOT NULL,
            movie_id INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            UNIQUE (user_id, media_type, movie_id)
        );
        CREATE TABLE IF NOT EXISTS watched_movies (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            media_type TEXT NOT NULL,
            movie_id INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            UNIQUE (user_id, media_type, movie_id)
        );
        CREATE TABLE IF NOT EXISTS watchlist (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            media_type TEXT NOT NULL,
            movie_id INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            UNIQUE (user_id, media_type, movie_id)
        );
    `)
    if err != nil {
        log.Fatal("Failed to ensure tables exist:", err)
    }
}