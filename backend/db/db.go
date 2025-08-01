package db


import (
	"database/sql"
	_ "github.com/lib/pq"
	"log"
	"os"
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
}