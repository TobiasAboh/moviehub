package handlers

import (
	"fmt"
	"net/http"
	"net/url"
	"os"
	"io"
	"encoding/json"

	"github.com/gin-gonic/gin"
)



func Movie(c *gin.Context) {
	mediaType := c.DefaultQuery("type", "movie")
	id := c.Param("id")
	
	apiKey := os.Getenv("TMDB_API_KEY")
	url := fmt.Sprintf("https://api.themoviedb.org/3/%s/%s?api_key=%s", mediaType, id, apiKey)
	fmt.Println(url)
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
	mediaType := c.DefaultQuery("type", "movie")
	id := c.Param("id")
	apiKey := os.Getenv("TMDB_API_KEY")
	url := fmt.Sprintf("https://api.themoviedb.org/3/%s/%s/videos?api_key=%s", mediaType, id, apiKey)
	
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

func SearchMovies(c *gin.Context) {
	query := c.Query("query")
	escapedQuery := url.QueryEscape(query)

	api := os.Getenv("TMDB_API_KEY")
	url := fmt.Sprintf("https://api.themoviedb.org/3/search/multi?api_key=%s&query=%s", api, escapedQuery)
	resp, err := http.Get(url)
	if err != nil || resp.StatusCode != 200 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find movie1"})
		return
	}
	defer resp.Body.Close()

	var result struct {
		Results []map[string]interface{} `json:"results"`
	}

	// var movieData map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find movie2"})
		return
	}
	filteredMovies := []map[string]interface{}{}
	for _, item := range result.Results {
		if item["media_type"] == "movie" || item["media_type"] == "tv" {
			filteredMovies = append(filteredMovies, item)
		}

	}

	c.JSON(http.StatusOK, filteredMovies)
}