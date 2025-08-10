package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strconv"

	"github.com/TobiasAboh/moviehub/backend/db"
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
	mediaType := c.Param("type")
	w := c.Writer
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	apiKey := os.Getenv("TMDB_API_KEY")
	url := fmt.Sprintf("https://api.themoviedb.org/3/%s/popular?api_key=%s", mediaType, apiKey)

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

// GetLikedMovies returns the authenticated user's liked movies
func GetLikedMovies(c *gin.Context) {
    email := c.GetString("email")
    if email == "" {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
        return
    }

    var userID int
    if err := db.DB.QueryRow("SELECT id FROM users WHERE email=$1", email).Scan(&userID); err != nil {
        if err == sql.ErrNoRows {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
            return
        }
        c.JSON(http.StatusInternalServerError, gin.H{"error": "DB error"})
        return
    }

    rows, err := db.DB.Query("SELECT media_type, movie_id FROM liked_movies WHERE user_id=$1", userID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "DB error"})
        return
    }
    defer rows.Close()

    type item struct {
        MediaType string `json:"media_type"`
        MovieID   int    `json:"movie_id"`
    }
    var items []item
    for rows.Next() {
        var it item
        if err := rows.Scan(&it.MediaType, &it.MovieID); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "DB error"})
            return
        }
        items = append(items, it)
    }
    c.JSON(http.StatusOK, gin.H{"items": items})
}

// GetWatchedMovies returns the authenticated user's watched movies
func GetWatchedMovies(c *gin.Context) {
    email := c.GetString("email")
    if email == "" {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
        return
    }

    var userID int
    if err := db.DB.QueryRow("SELECT id FROM users WHERE email=$1", email).Scan(&userID); err != nil {
        if err == sql.ErrNoRows {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
            return
        }
        c.JSON(http.StatusInternalServerError, gin.H{"error": "DB error"})
        return
    }

    rows, err := db.DB.Query("SELECT media_type, movie_id FROM watched_movies WHERE user_id=$1", userID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "DB error"})
        return
    }
    defer rows.Close()

    type item struct {
        MediaType string `json:"media_type"`
        MovieID   int    `json:"movie_id"`
    }
    var items []item
    for rows.Next() {
        var it item
        if err := rows.Scan(&it.MediaType, &it.MovieID); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "DB error"})
            return
        }
        items = append(items, it)
    }
    c.JSON(http.StatusOK, gin.H{"items": items})
}

// LikeMovie handles adding/removing a movie to the authenticated user's liked_movies
func LikeMovie(c *gin.Context) {
    email := c.GetString("email")
    if email == "" {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
        return
    }

    // Resolve user id
    var userID int
    if err := db.DB.QueryRow("SELECT id FROM users WHERE email=$1", email).Scan(&userID); err != nil {
        if err == sql.ErrNoRows {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
            return
        }
        c.JSON(http.StatusInternalServerError, gin.H{"error": "DB error"})
        return
    }

    mediaType := c.Param("media")
    idStr := c.Param("id")
    movieID, err := strconv.Atoi(idStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid movie id"})
        return
    }

    // Optional toggle based on request body
    var body struct {
        Liked *bool `json:"liked"`
    }
    _ = c.BindJSON(&body)

    if body.Liked != nil && !*body.Liked {
        // Remove like
        if _, err := db.DB.Exec(
            "DELETE FROM liked_movies WHERE user_id=$1 AND media_type=$2 AND movie_id=$3",
            userID, mediaType, movieID,
        ); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove like"})
            return
        }
        c.JSON(http.StatusOK, gin.H{"status": "unliked"})
        return
    }

    // Add like idempotently
    if _, err := db.DB.Exec(
        "INSERT INTO liked_movies (user_id, media_type, movie_id) VALUES ($1,$2,$3) ON CONFLICT (user_id, media_type, movie_id) DO NOTHING",
        userID, mediaType, movieID,
    ); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to like movie"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"status": "liked"})
}

// WatchMovie handles adding/removing a movie to the authenticated user's watched_movies
func WatchMovie(c *gin.Context) {
    email := c.GetString("email")
    if email == "" {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
        return
    }

    // Resolve user id
    var userID int
    if err := db.DB.QueryRow("SELECT id FROM users WHERE email=$1", email).Scan(&userID); err != nil {
        if err == sql.ErrNoRows {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
            return
        }
        c.JSON(http.StatusInternalServerError, gin.H{"error": "DB error"})
        return
    }

    mediaType := c.Param("media")
    idStr := c.Param("id")
    movieID, err := strconv.Atoi(idStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid movie id"})
        return
    }

    // Optional toggle based on request body
    var body struct {
        Watched *bool `json:"watched"`
    }
    _ = c.BindJSON(&body)

    if body.Watched != nil && !*body.Watched {
        if _, err := db.DB.Exec(
            "DELETE FROM watched_movies WHERE user_id=$1 AND media_type=$2 AND movie_id=$3",
            userID, mediaType, movieID,
        ); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove watched"})
            return
        }
        c.JSON(http.StatusOK, gin.H{"status": "unwatched"})
        return
    }

    if _, err := db.DB.Exec(
        "INSERT INTO watched_movies (user_id, media_type, movie_id) VALUES ($1,$2,$3) ON CONFLICT (user_id, media_type, movie_id) DO NOTHING",
        userID, mediaType, movieID,
    ); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add to watched"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"status": "watched"})
}