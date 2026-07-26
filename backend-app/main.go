package main

import (
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/IsUnderAchiever/bilibili-cron-job/backend-app/routes"
)

func main() {
	// Create a Gin router with default middleware (logger and recovery)
	r := gin.Default()

	// Configure CORS — allow the Vite dev server origin.
	// Use AllowOriginFunc for flexible matching so both "localhost" and "127.0.0.1"
	// work, and Vite's automatic port-hopping (5173 → 5174 → 5175) is covered.
	r.Use(cors.New(cors.Config{
		AllowOriginFunc: func(origin string) bool {
			// Accept requests without an Origin header (curl, Postman, etc.)
			if origin == "" {
				return true
			}
			// Allow any localhost / 127.0.0.1 origin on typical Vite dev ports
			if strings.HasPrefix(origin, "http://localhost:517") ||
				strings.HasPrefix(origin, "http://127.0.0.1:517") {
				return true
			}
			return false
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Register all API routes
	routes.SetupRoutes(r)

	// Start server on port 8080
	r.Run(":8080")
}
