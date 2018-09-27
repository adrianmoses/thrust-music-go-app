package models

import (
	"github.com/jinzhu/gorm"
)

type Content struct {
	gorm.Model
	ArtistID      int `gorm:"index" json:"artist_id`
	ContentPath   string `json:"content_path"`
	Staged        bool `json:"staged"`
	ContentType   string `json:"content_type"`
	Deleted       bool `json:"deleted"`
	ContentTypeID uint `json:"content_type_id"`
}
