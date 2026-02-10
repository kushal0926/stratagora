package handlers

import (
	"net/http"

	"github.com/kushal0926/stratagora/backend/pkg/response"
)

type ClaudeHandler struct{}

func NewClaudeHandler() *ClaudeHandler {
	return &ClaudeHandler{}
}

// Chat - placeholder for AI chat
func (h *ClaudeHandler) Chat(w http.ResponseWriter, r *http.Request) {
	response.Error(w, http.StatusNotImplemented, "AI chat adding soon")
}
