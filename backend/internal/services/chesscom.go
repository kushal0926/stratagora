package services

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

type ChesscomService struct {
	client *http.Client
}

// chess.cm api response type
type ChesscomPlayer struct {
	Username string `json:"username"`
	Rating int `json:"rating"`
	Title string `json:"title,omitempty"`
	Avatar string `json:"avatar,omitempty"`
	Country string `json:"country,omitempty"`
	LastOnline int64 `json:"last_online,omitempty"`
}

type ChesscomGame struct {
	URL string `json:"url"`
	PGN string `json:"pgn"`
	TimeControl string `json:"time_control"`
	EndTime int64 `json:"end_time"`
	Rated bool `json:"rated"`
	TimeClass string `json:"time_class"`
	Rules string `json:"rules"`
	White ChesscomPlayer `json:"white"`
	Black ChesscomPlayer `json:"black"`
}

type ChesscomGamePlayer struct {
	Rating int `json:"rating"`
	Result string `json:"result"`
	Username string `json:"username"`
}

type ChesscomArchive struct {
	Archives []string `json:"archives"`
}


type ChesscomGamesResponse struct {
	Games []ChesscomGame `json:"games"`
}

func NewChesscomService() *ChesscomService {
	return &ChesscomService{
		client: &http.Client{
			Timeout: 15 * time.Second,
		},
	}
}

// client fetche his chess.com profile
func (s *ChesscomService) GetPlayer(username string) (*ChesscomPlayer, error) {
	url := fmt.Sprintf("https://api.chess.com/pub/player/%s", username)

	req, err :=  http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("failer to create request: %w", err)
	}

	// chesscom requires a user-agent header
	req.Header.Set("user-agent", "stratagora chess app")

	res, err := s.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch player: %w", err)
	}
	// if failed to fetch player lets jusr close
	defer res.Body.Close()

	if res.StatusCode == 404 {
		return nil, fmt.Errorf("player '%s' not found", username)
	}

	if res.StatusCode != 200 {
		return nil, fmt.Errorf("chess.com api error: status %d", res.StatusCode)
	}

	body , err := io.ReadAll(res.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	var player ChesscomPlayer
	if err := json.Unmarshal(body, &player); err != nil {
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}

	return &player, nil
}

// fectching recent games if the player
func (s *ChesscomService) GetRecentGames(username string, limit int) ([]ChesscomGame, error) {
	// getting the archive games
	archiveURL := fmt.Sprintf("https://api.chess.com/pub/player/%s/games/archives", username)

	req, err := http.NewRequest("GET", archiveURL, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("user-agent", "stratagora chess app")

	res, err := s.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch archives: %w", err)
	}

	defer res.Body.Close()

	if res.StatusCode == 404 {
		return nil, fmt.Errorf("player '%s' not found", username)
	}

	if res.StatusCode != 200 {
		return nil, fmt.Errorf("chess.com api error: status %d", res.StatusCode)
	}

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read archives: %w", err)
	}

	var archives ChesscomArchive
	if err := json.Unmarshal(body, &archives); err != nil {
		return nil, fmt.Errorf("failed to parse archives : %w", err)
	}

	if len(archives.Archives) == 0 {
		return []ChesscomGame{}, nil
	}

	// getting the most recent games
	latestArchive := archives.Archives[len(archives.Archives)-1]
	games, err := s.fetchGamesFromArchive(latestArchive)
	if err != nil {
		return nil, err
	}

	// returning only standard chess games,, most recent first
	var filteredGames []ChesscomGame
	for i := len(games) -1; i >=0; i-- {
		if games[i].Rules ==  "chess" {
			filteredGames = append(filteredGames, games[i])
			if len(filteredGames) >= limit {
				break
			}
		}
	}

	return filteredGames, nil
}

// fetching games from a specific archive URL
func (s *ChesscomService) fetchGamesFromArchive(archiveURL string) ([]ChesscomGame, error) {
	req, err := http.NewRequest("GET", archiveURL, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("user-agent", "stratagora chess app")

	res, err := s.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch games: %w", err)
	}

	defer res.Body.Close()

	if res.StatusCode != 200 {
		return nil, fmt.Errorf("chess.com api error: status %d", res.StatusCode)
	}

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read games: %w", err)
	}

	var gameResponse ChesscomGamesResponse
	if err := json.Unmarshal(body, &gameResponse); err != nil {
		return nil, fmt.Errorf("failed to parse games: %w", err)
	}

	return gameResponse.Games, nil

}
