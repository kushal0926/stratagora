package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

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
