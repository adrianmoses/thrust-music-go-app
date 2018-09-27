package models

import (
    "github.com/jinzhu/gorm"
    "github.com/lib/pq"
)

type Hook struct {
    gorm.Model
    Message   string `json:"message"`
    IsActive bool `json:"is_active"`
    MediaUrls pq.StringArray `json:"media_urls" gorm:"type:varchar(100)[]"`
    ActionProvider  string `json:"action"`
    Statement string `json:"statement"`
    TriggerProvider string `json:"trigger"`
    ArtistID int `json:"artist_id"`
}