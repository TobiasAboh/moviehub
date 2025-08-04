package handlers

import (
	"fmt"
	"net/http"
	"os"
	"io"
	"encoding/json"

	"github.com/gin-gonic/gin"
)



func Movie(c *gin.Context) {
	id := c.Param("id")
	
	apiKey := os.Getenv("TMDB_API_KEY")
	url := fmt.Sprintf("https://api.themoviedb.org/3/movie/%s?api_key=%s", id, apiKey)

	resp, err := http.Get(url)
	if err != nil || resp.StatusCode != 200 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch movie data"})
		return
	}
	defer resp.Body.Close()

	var movieData map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&movieData); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch movie data"})
		return
	}
	c.JSON(http.StatusOK, movieData)
}

func MovieVideos(c *gin.Context) {
	id := c.Param("id")
	apiKey := os.Getenv("TMDB_API_KEY")
	url := fmt.Sprintf("https://api.themoviedb.org/3/movie/%s/videos?api_key=%s", id, apiKey)

	resp, err := http.Get(url)

	if err != nil || resp.StatusCode != 200 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch movie videos1"})
		return
	}
	defer resp.Body.Close()

	var movieData map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&movieData); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch movie videos2"})
		return
	}

	c.JSON(http.StatusOK, movieData)
}

func GetMovies(c *gin.Context) {
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