package models

import (
	"github.com/jinzhu/gorm"
)

type Artist struct {
	gorm.Model
	UserID          uint   `gorm:"index"  json:"user_id"`
	Name            string `json:"name"`
	Description     string `json:"description"`
	IsActive        bool   `json:"is_active"`
	ProfileImageUrl string   `json:"profile_image_url"`
}
