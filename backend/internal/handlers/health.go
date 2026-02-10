package handlers

import (
	"net/http"
	"runtime"
	"time"

	"github.com/kushal0926/stratagora/backend/pkg/response"
)

type HealthHandeler struct {
	startTime time.Time
}

func NewHealthHandler() *HealthHandeler {
	return &HealthHandeler{
		startTime: time.Now(),
	}
}

// return api health status
func (h *HealthHandeler) Health(w http.ResponseWriter, r *http.Request) {
	uptime := time.Since(h.startTime)

	data := map[string]any{
		"status":  "healthy",
		"service": "stratagora api",
		"version": "1.0.0",
		"uptime":  uptime.String(),
		"golang":  runtime.Version(),
	}

	response.Success(w, "api is running fine", data)
}

// ping-pong response check
func (h *HealthHandeler) Ping(w http.ResponseWriter, r *http.Request) {
	response.Success(w, "pong", nil)
}
