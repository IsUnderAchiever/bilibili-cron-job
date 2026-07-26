package handlers

import (
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/IsUnderAchiever/bilibili-cron-job/backend-app/models"
)

var (
	// In-memory mock user storage
	users = []models.User{
		{ID: 1, Name: "Alice", Email: "alice@example.com"},
		{ID: 2, Name: "Bob", Email: "bob@example.com"},
		{ID: 3, Name: "Charlie", Email: "charlie@example.com"},
	}
	// Auto-increment ID counter
	nextID = 4
	mu     sync.Mutex
)

// GetUsers handles GET /api/v1/users
// Returns the list of all mock users.
func GetUsers(c *gin.Context) {
	mu.Lock()
	// Return a copy to avoid concurrent modification issues
	result := make([]models.User, len(users))
	copy(result, users)
	mu.Unlock()

	c.JSON(http.StatusOK, models.SuccessResponse(result))
}

// CreateUser handles POST /api/v1/users
// Accepts JSON {name, email}, creates a new user with auto-increment ID,
// and returns the created user.
func CreateUser(c *gin.Context) {
	var req models.CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse(400, "Invalid request: "+err.Error()))
		return
	}

	mu.Lock()
	user := models.User{
		ID:    nextID,
		Name:  req.Name,
		Email: req.Email,
	}
	nextID++
	users = append(users, user)
	mu.Unlock()

	c.JSON(http.StatusCreated, models.SuccessResponse(user))
}
