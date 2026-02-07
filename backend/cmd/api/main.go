package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/corentings/chess/v2"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
)

func main() {
	// loading the env files
	if err := godotenv.Load(); err != nil {
		log.Println("no .env file found")
	}

	// getting the port from the env or setting it to default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// creating router through chi
	router := chi.NewRouter()


	// middleware
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)
	// enabling CORS so frontend can call to backend
	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST","PUT","DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: true,
	}))

	//routes
	router.Get("/", func(w http.ResponseWriter, r *http.Request) {
		json.NewEncoder(w).Encode(map[string]string{
			"message": "yo me from the stratagora api!",
			"status": "perfect, working just fine",
		})
	})
	// checking endpoint if it is working
	router.Get("/healthy", func(w http.ResponseWriter, r *http.Request) {
		json.NewEncoder(w).Encode(map[string]string{
			"status": "perfect, working just fine",
		})
	})

	fmt.Printf("server running on port %s\n", port)
	if err := http.ListenAndServe(":"+port, router); err != nil {
		log.Fatal(err)
	}


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
