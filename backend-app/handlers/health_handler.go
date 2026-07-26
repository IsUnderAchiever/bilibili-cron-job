package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// HealthCheck handles GET /api/v1/health
// Returns a simple JSON status indicating the server is running.
func HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status": "ok",
	})
}
