package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/joho/godotenv"
	custom_middleware "github.com/kushal0926/stratagora/backend/internal/custom_middleare"
	"github.com/kushal0926/stratagora/backend/internal/handlers"
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

	// handlers
	healthHandler := handlers.NewHealthHandler()
	chessHandler := handlers.NewChessHandler()
	chesscomHandler := handlers.NewChesscomHandler()
	claudeHandler := handlers.NewClaudeHandler()

	// creating router through chi
	router := chi.NewRouter()

	// middleware
	router.Use(middleware.RequestID)
	router.Use(middleware.RealIP)
	router.Use(middleware.Recoverer)
	router.Use(custom_middleware.Logger)
	router.Use(custom_middleware.CORS())

	//routes health check
	router.Get("/", healthHandler.Health)
	router.Get("/health", healthHandler.Health)
	router.Get("/ping", healthHandler.Ping)

	// api routes
	router.Route("/api", func(r chi.Router) {
		// chess analysis routes
		r.Route("/chess", func(r chi.Router) {
			r.Post("/analyze", chessHandler.AnalyzeGame)
			r.Post("/evaluate", chessHandler.EvaluatePosition)
		})

		// chess.com integration routes
		r.Route("/chesscom", func(r chi.Router) {
			r.Post("/player", chesscomHandler.GetPlayer)
			r.Post("/games", chesscomHandler.FetchGames)
		})

		// AI routes
		r.Route("/claude", func(r chi.Router) {
			r.Post("/chat", claudeHandler.Chat)
		})
	})

	printRoutes(router)

	// start the server
	fmt.Printf("\n🚀 stratagora api server\n")
	fmt.Printf("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
	fmt.Printf("📍 server running on: http://localhost:%s\n", port)
	fmt.Printf("🏥 health check: http://localhost:%s/health\n", port)
	fmt.Printf("📚 api endpoints: http://localhost:%s/api\n", port)
	fmt.Printf("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n")
	if err := http.ListenAndServe(":"+port, router); err != nil {
		log.Fatal(err)
	}

}

func printRoutes(r chi.Router) {
	walkFunc := func(method string, route string, handler http.Handler, middlewares ...func(http.Handler) http.Handler) error {
		log.Printf("%-6s %s", method, route)
		return nil
	}

	if err := chi.Walk(r, walkFunc); err != nil {
		log.Printf("Error walking routes: %s\n", err.Error())
	}
}
