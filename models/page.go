package models

import (
    "github.com/jinzhu/gorm"
)

type Page struct {
    gorm.Model
    ArtistID        int
    ArtistName      string
    Title           string
    HTML            string
    PageHash        string
    PageSlug        string
}