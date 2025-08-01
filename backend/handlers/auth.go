package handlers

import (
	"github.com/TobiasAboh/moviehub/backend/db"
	"github.com/TobiasAboh/moviehub/backend/models"
	"github.com/TobiasAboh/moviehub/backend/utils"

	"fmt"
	"golang.org/x/crypto/bcrypt"
	"github.com/gin-gonic/gin"
	"net/http"
)


func SignUp(c *gin.Context) {
	var req models.UserInput
	if err := c.BindJSON(&req); err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	var exists bool
	err := db.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE email=$1)", req.Email).Scan(&exists)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DB Error"})
	}

	if exists {
		c.JSON(http.StatusConflict, gin.H{"error": "User already exists"})
		return
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	_, err = db.DB.Exec("INSERT INTO users (username, email, password) VALUES ($1, $2, $3)", req.Username, req.Email, string(hashedPassword))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Insert failed"})
		return
	}

	//Create JWT
	token, err := utils.GenerateJWT(req.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create token"})
		return
	}

	// Set JWT as httpOnly cookie
	c.SetCookie("token", token, 3600*24, "/", "localhost", false, true)
	fmt.Println("Cookie set: ", token)
	c.JSON(http.StatusOK, gin.H{"message": "User created successfully"})
}

func Login(c *gin.Context) {
	var req models.UserInput
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Input"})
	}
	var hashed string
	err := db.DB.QueryRow("SELECT password FROM users WHERE email=$1", req.Email).Scan(&hashed)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}

	if bcrypt.CompareHashAndPassword([]byte(hashed), []byte(req.Password)) != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
	}

	//Create JWT
	token, err := utils.GenerateJWT(req.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create token"})
		return
	}

	// Set JWT as httpOnly cookie

	c.SetCookie("token", token, 3600*24, "/", "localhost", false, true)

	c.JSON(http.StatusOK, gin.H{"message": "Login successful"})
}