package models

import (
    "github.com/jinzhu/gorm"
    "time"
)

type PageAnalytics struct {
    gorm.Model
    Provider        string
    ArtistID        int
    PageID          int
    EntryDate       time.Time
    Metric          string
    MetricValue     int64
}