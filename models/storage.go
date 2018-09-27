package models

import (
	"time"
	"github.com/jinzhu/gorm"
)

type Storage struct {
	gorm.Model
	ArtistID     uint      `gorm:"index"  json:"artist_id"`
    IsConnected  bool      `sql:"DEFAULT:false"`
	Provider     string    `json:"provider"`
    DirPath      string    `json:"dir_path"`
	AccessToken  string    `json:"access_token"`
	RefreshToken string    `json:"refresh_token"`
	TokenSecret  string    `json:"token_secret"`
	ExpiresAt    time.Time `json:"expires_at"`
}
