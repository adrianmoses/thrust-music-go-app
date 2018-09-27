package models

import (
    "github.com/jinzhu/gorm"
    "time"
)

type SocialAnalytics struct {
    gorm.Model
    Provider        string    `json:"provider"`
    ArtistID        int       `json:"artist_id"`
    SocialID        int       `json:"social_id"`
    EntryDate       time.Time `json:"entry_date"`
    Metric          string    `json:"metric"`
    MetricValue     int64     `json:"metric_value"`
}