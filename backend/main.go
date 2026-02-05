package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/corentings/chess/v2"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

func main() {
	router := chi.NewRouter()

	// enabling CORS so frontend can call to backend
	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: true,
	}))

	// checking emdpoint
	router.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		json.NewEncoder(w).Encode(map[string]string{
			"status": "okay!",
		})
	})

	// parsing endpoint for PGN
	router.Post("/parse-pgn", parsePGNHandler)

	fmt.Println("server is running on :8080")
	http.ListenAndServe(":8080", router)


}

func parsePGNHandler(w http.ResponseWriter, r *http.Request) {
		// w.Header().Set("Content-Type", "application/json")
		
		var req struct {
		PGN string `json:"pgn"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "invalid request")
		return
	}

	game := chess.NewGame()
	if err := game.UnmarshalText([]byte(req.PGN)); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "invalid PGN")
		return
	}

	moves := []map[string]string{}
	for i, move := range game.Moves() {
		moves = append(moves, map[string]string{
			"moveNumber": fmt.Sprintf("%d", i+1),
			"notation":   move.String(),
		})
	}

	json.NewEncoder(w).Encode(map[string]any{
		"moves": moves,
	})
}
