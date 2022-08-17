package model

import "time"

type Tweet struct {
	ID      int       `json:"id"`
	Content string    `json:"content"`
	UserID  string    `json:"user_id"`
	Created time.Time `json:"created"`
	Image   string    `json:"image"`
}
