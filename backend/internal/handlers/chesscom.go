package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/kushal0926/stratagora/backend/internal/services"
	"github.com/kushal0926/stratagora/backend/pkg/response"
)

type ChesscomHandler struct {
	chesscomService *services.ChesscomService
}

func NewChesscomHandler() *ChesscomHandler {
	return &ChesscomHandler{
		chesscomService: services.NewChesscomService(),
	}
}

type FetchGameRequest struct {
	Username string `json:"username"`
	Limit    int    `json:"limit"`
}

type FetchPlayerRequest struct {
	Username string `json:"username"`
}

// fetch games - placeholder for Chess.com API integration
func (h *ChesscomHandler) GetPlayer(w http.ResponseWriter, r *http.Request) {
	var req FetchPlayerRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "invalid request body")
	}

	if req.Username == "" {
		response.Error(w, http.StatusBadRequest, "username is required")
		return
	}

	player, err := h.chesscomService.GetPlayer(req.Username)
	if err != nil {
		response.Error(w, http.StatusNotFound, err.Error())
		return
	}

	response.Success(w, "player found", player)
}

// fetching recent games for chess0.com player
func (h *ChesscomHandler) FetchGames(w http.ResponseWriter, r *http.Request) {
	var req FetchGameRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "invalid request body")
		return
	}

	if req.Username == "" {
		response.Error(w, http.StatusBadRequest, "username is required")
		return
	}

	// default to 10 games
	limit := req.Limit
	if limit <= 0 || limit > 50 {
		limit = 10
	}

	games, err := h.chesscomService.GetRecentGames(req.Username, limit)
	if err != nil {
		response.Error(w, http.StatusBadRequest, err.Error())
		return
	}

	response.Success(w, "games fetched successfully", map[string]any{
		"games":    games,
		"count":    len(games),
		"username": req.Username,
	})
}
