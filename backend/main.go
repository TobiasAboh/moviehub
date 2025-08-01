package main

import (
	// "encoding/json"
	"github.com/TobiasAboh/moviehub/backend/db"
	"github.com/TobiasAboh/moviehub/backend/handlers"
	"github.com/TobiasAboh/moviehub/backend/middleware"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/gin-contrib/cors"
	"time"
)



func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	db.InitDB()

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{"GET", "POST", "OPTIONS"},
		AllowHeaders: []string{"Content-Type"},
		AllowCredentials: true,
		MaxAge: 12 * time.Hour,
	}))

	r.POST("/signup", handlers.SignUp)
	r.POST("/login", handlers.Login)
	r.GET("/profile", middleware.AuthMiddleware(), handlers.Profile)
	r.GET("/api/movies", getMovies)
	

	fmt.Println("Server running on :8080")
	r.Run(":8080")
}


func getMovies(c *gin.Context) {
	w := c.Writer
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	apiKey := os.Getenv("TMDB_API_KEY")
	url := fmt.Sprintf("https://api.themoviedb.org/3/movie/popular?api_key=%s", apiKey)

	resp, err := http.Get(url)
	if err != nil {
		http.Error(w, "Failed to fetch from TMDb", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	io.Copy(w, resp.Body)
}





