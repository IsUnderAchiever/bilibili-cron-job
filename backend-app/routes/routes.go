package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/IsUnderAchiever/bilibili-cron-job/backend-app/handlers"
)

// SetupRoutes registers all API routes on the given Gin engine.
func SetupRoutes(r *gin.Engine) {
	v1 := r.Group("/api/v1")
	{
		// Health check
		v1.GET("/health", handlers.HealthCheck)

		// User routes
		v1.GET("/users", handlers.GetUsers)
		v1.POST("/users", handlers.CreateUser)
	}
}
