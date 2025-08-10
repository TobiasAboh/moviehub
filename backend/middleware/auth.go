package middleware

import (
	"github.com/TobiasAboh/moviehub/backend/utils"

	"net/http"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenStr, err := c.Cookie("token")
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "No auth token"})
			return
		}

        claims, err := utils.VerifyJWT(tokenStr)
        if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			return
		}

        // Extract email claim safely
        var email string
        if claims != nil {
            if v, ok := claims["email"]; ok {
                if s, ok := v.(string); ok {
                    email = s
                }
            }
        }
        if email == "" {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token payload"})
            return
        }

        c.Set("email", email)
		c.Next()
	}
}