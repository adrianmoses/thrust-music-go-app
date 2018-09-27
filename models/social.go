package models

import (
	"github.com/jinzhu/gorm"
	"time"
)

type Social struct {
	gorm.Model
	Provider        string `json:"provider"`
	UId             string `json:"uid"`
	Name            string `json:"name"`
	ProfileImageURL string `json:"profile_image_url"`
	OauthToken      string `json:"oauth_token"`
	RefreshToken    string `json:"refresh_token"`
	OauthExpiresAt  time.Time `json:"oauth_expires_at"`
	AccountType     string  `json:"account_type"`
	PageAccessToken string  `json:"page_access_token"`
	PageName        string `json:"page_name"`
	TokenSecret     string `json:"token_secret"`
	UserID          int `json:"user_id"`
	PageID          int64 `json:"page_id"`
	ChannelID       string `json:"channel_id"`
	ArtistID        int `json:"artist_id"`
}
