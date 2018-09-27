package models

import (
	"github.com/jinzhu/gorm"
)

type Asset struct {
	gorm.Model
	UrlPath   string
	Staged    bool
	FileType  string
	ContentID int
}
