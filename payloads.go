package main

import (
    "time"
)

type Payload struct {
    id string `json:id`
    status string `json:status`
}

type TestPayload struct {
    Payload
    Message string `json:message`
}

type AudioTranscodePayload struct {
    Payload
    SourceUrl string `json:"source_url"`
    TargetUrl string `json:"target_url"`
    TranscodeType string `json:"transcode_type"`
    TrackID int `json:"track_id"`
}

type VideoTranscodePayload struct {
    Payload
    SourceUrl string `json:"source_url"`
    TargetUrl string `json:"target_url"`
    ImageUrl string `json:"image_url"`
    TranscodeType string `json:"transcode_type"`
    TrackID int `json:"track_id"`
}

type SocialSendPayload struct {
    Payload
    Provider string `json:"provider"`
    Message string `json:"message"`
    Title string `json:"title"`
    VideoUrl string `json:"video_url"`
    ImageUrl string `json:"image_url"`
    SendAt time.Time `json:"send_at"`
    SocialID int `json:"social_id"`
    EventID int `json:"event_id"`
}

type SocialDataCheckPayload struct {
    Payload
    Provider string `json:"provider"`
    ArtistID int `json:"artist_id"`
    SocialID int `json:"social_id"`
}

type HookCheckPayload struct {
    Payload
    Trigger string `json:"trigger"`
    Action string `json:"action"`
    Message string `json:"message"`
    Service string `json:"service"`
    ArtistID int `json:"artist_id"`
}