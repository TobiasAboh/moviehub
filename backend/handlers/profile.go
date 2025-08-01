package handlers

import (
	"github.com/gin-gonic/gin"
)

func Profile(c *gin.Context) {
	email := c.GetString("email")
	c.JSON(200, gin.H{"loggedIn": true, "email": email})
}