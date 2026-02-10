package handlers

import (
	"net/http"

	"github.com/kushal0926/stratagora/backend/pkg/response"
)

type ChesscomHandler struct{}

func NewChesscomHandler() *ChesscomHandler {
	return &ChesscomHandler{}
}

// fetch games - placeholder for Chess.com API integration
func (h *ChesscomHandler) FetchGames(w http.ResponseWriter, r *http.Request) {
	response.Error(w, http.StatusNotImplemented, "add soon")
}
