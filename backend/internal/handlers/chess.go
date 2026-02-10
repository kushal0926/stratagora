package handlers

import (
	"net/http"

	"github.com/kushal0926/stratagora/backend/pkg/response"
)

type ChessHandler struct{}

func NewChessHandler() *ChessHandler {
	return &ChessHandler{}
}

// analyze game - for stockfish analysis
func (h *ChessHandler) AnalyzeGame(w http.ResponseWriter, r *http.Request) {
	response.Error(w, http.StatusNotImplemented, "will add soon")
}

// evaluating position
func (h *ChessHandler) EvaluatePosition(w http.ResponseWriter, r *http.Request) {
	response.Error(w, http.StatusNotImplemented, "will add soon this too")
}
