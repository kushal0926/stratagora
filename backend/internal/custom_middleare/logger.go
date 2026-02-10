package custom_middleware

import (
	"log"
	"net/http"
	"time"
)

//logger middleware logs HTTP requests
func Logger(next http.Handler) http.Handler{
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// custom response writer to capture status code
		rw := &responseWriter{ResponseWriter: w, statusCode: http.StatusOK}

		next.ServeHTTP(rw,r)

		durarion := time.Since(start)

		log.Printf(
			"%s %s %d %v",
			r.Method,
			r.RequestURI,
			rw.statusCode,
			durarion,
		)
	})
}


type responseWriter struct {
	http.ResponseWriter
	statusCode int
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}
