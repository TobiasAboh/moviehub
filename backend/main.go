package main

import (
	// "encoding/json"
	"fmt"
	"log"

	"github.com/TobiasAboh/moviehub/backend/db"
	"github.com/TobiasAboh/moviehub/backend/handlers"
	"github.com/TobiasAboh/moviehub/backend/middleware"

	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
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
	r.GET("/popular/:type", handlers.GetMovies)
	r.GET("/content/:id", handlers.Movie)
	r.GET("/content/:id/videos", handlers.MovieVideos)
	r.GET("/search/multi", handlers.SearchMovies)
    r.POST("/like/:media/:id", middleware.AuthMiddleware(), handlers.LikeMovie)
    r.POST("/watch/:media/:id", middleware.AuthMiddleware(), handlers.WatchMovie)
    r.POST("/watchlist/:media/:id", middleware.AuthMiddleware(), handlers.AddToWatchlist)
    r.GET("/watchlist", middleware.AuthMiddleware(), handlers.GetWatchlist)
    r.GET("/liked", middleware.AuthMiddleware(), handlers.GetLikedMovies)
    r.GET("/watched", middleware.AuthMiddleware(), handlers.GetWatchedMovies)
	r.GET("/filter", handlers.Filter)

	r.GET("/test", func(c *gin.Context) {
		fmt.Println("Test route hit")
		c.JSON(404, gin.H{"message": "Success"})
	})

	fmt.Println("Server running on :8080")
	r.Run(":8080")
}








