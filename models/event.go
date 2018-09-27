package models

import (
	"github.com/jinzhu/gorm"
	"github.com/lib/pq"
	"time"
)

type Event struct {
	gorm.Model
	Title     string `json:"title"`
	Message   string `json:"message"`
	SendAt    time.Time `json:"send_at"`
	SentAt    time.Time `json:"sent_at"`
	Sent      bool  `json:"sent"`
	MediaUrls pq.StringArray `gorm:"type:varchar(100)[]" json:"media_urls"`
	PublicURL string `json:"public_url"`
	Provider  string `json:"provider"`
	SocialID  int `json:"social_id"`
	ArtistID int `json:"artist_id"`
}
