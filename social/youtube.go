package social

import (
    "os"
    "fmt"
    "log"
    "net/http"
    "google.golang.org/api/youtube/v3"
    "golang.org/x/oauth2"
    config "github.com/ammoses89/thrust-outreach/config"
    dbc "github.com/ammoses89/thrust-outreach/db"
)

type ChannelStatsResponse struct {
    Views uint64 `json:"views"`
    Subscribers uint64 `json:"subscribers"`
}

// https://github.com/youtube/api-samples/blob/master/go/upload_video.go
// https://developers.google.com/youtube/v3/code_samples/go
type Youtube struct {
    ClientID string
    ClientSecret string
    conf *oauth2.Config
}

func MakeYoutube() *Youtube {
    cfg := config.LoadConfig("config/config.yaml")
    config := &oauth2.Config{
                ClientID:     cfg.Youtube.ClientID,
                ClientSecret: cfg.Youtube.ClientSecret,
                Endpoint:     oauth2.Endpoint{
                    AuthURL:      "https://accounts.google.com/o/oauth2/auth",
                    TokenURL:     "https://accounts.google.com/o/oauth2/token",
                },
                Scopes:       []string{youtube.YoutubeScope, 
                        youtube.YoutubeReadonlyScope, 
                        youtube.YoutubeUploadScope},
                RedirectURL:  "http://localhost:3000/api/social/youtube/callback",
    }
    return &Youtube{ClientID: cfg.Youtube.ClientID, 
        ClientSecret: cfg.Youtube.ClientSecret,
        conf: config}
}

func (yt *Youtube) GetAuthorizeURL(jwtToken string) string {
    oauth2RedirectURI := oauth2.SetAuthURLParam("redirect_uri", "http://localhost:3000/api/social/youtube/callback")
    oauth2ResponseType := oauth2.SetAuthURLParam("response_type", "code")
    url := yt.conf.AuthCodeURL(jwtToken, oauth2RedirectURI, oauth2ResponseType)
    log.Printf("URL: %s", url)
    return url
}

func (yt *Youtube) ExchangeCodeForToken(code string) (*oauth2.Token, error) {
    token, err := yt.conf.Exchange(oauth2.NoContext, code)
    if err != nil {
        log.Printf("Unable to retrieve token from web %v", err)
        return nil, err
    }
    return token, nil
}


func (yt *Youtube) BuildYoutubeClient(accessToken string) *http.Client {
    config := yt.conf
    log.Println("AccessToken: ", accessToken)

    return config.Client(oauth2.NoContext, &oauth2.Token{AccessToken: accessToken})
}

func (yt *Youtube) GetChannelProfilePicture(accessToken string) (string, error) {
    client := yt.BuildYoutubeClient(accessToken)
    service, err := youtube.New(client)
    if err != nil {
        log.Printf("Error creating YouTube client: %v", err)
        return "", err
    }


    call := service.Channels.List("snippet").Mine(true)
    response, err := call.Do()
    if err != nil {
        log.Printf("Error request channels list: %#v", err)
        return "", err
    }
    firstChannel := response.Items[0]
    return firstChannel.Snippet.Thumbnails.Default.Url, nil
}

func (yt *Youtube) GetChannelViews(accessToken string, channelID string) (uint64, error) {
    client := yt.BuildYoutubeClient(accessToken)
    service, err := youtube.New(client)
    if err != nil {
        log.Printf("Error creating YouTube client: %v", err)
        return 0, err
    }

    call := service.Channels.List("statistics").Mine(true)
    response, err := call.Do()

    if err != nil {
        log.Printf("Error request channels list: %#v", err)
        return 0, err
    }
    channel := response.Items[0]
    views := channel.Statistics.ViewCount
    return views, nil
}

func (yt *Youtube) GetChannelSubscribers(accessToken string, channelID string) (uint64, error) {
    client := yt.BuildYoutubeClient(accessToken)
    service, err := youtube.New(client)
    if err != nil {
        log.Printf("Error creating YouTube client: %v", err)
        return 0, err
    }

    call := service.Channels.List("statistics").Mine(true)
    response, err := call.Do()

    if err != nil {
        log.Printf("Error request channels list: %#v", err)
        return 0, err
    }
    channel := response.Items[0]
    subscribers := channel.Statistics.SubscriberCount
    return subscribers, nil

}

// func (yt *Youtube) GetChannelLikes(accessToken string, channelID string) (int64, error) {
//     client := yt.BuildYoutubeClient(accessToken)
//     service, err := youtube.New(client)
//     if err != nil {
//         log.Printf("Error creating YouTube client: %v", err)
//         return 0, err
//     }

//     call := service.Channels.List("statistics").Mine(true)
//     response, err := call.Do()

//     if err != nil {
//         log.Printf("Error request channels list: %#v", err)
//         return 0, err
//     }
//     channel := response.Items[0]
//     likes := channel.Statistics.LikeCount
//     return likes, nil
// }

func (yt *Youtube) GetChannelStats(socialID int) (*ChannelStatsResponse, error) {
    cfg := config.LoadConfig("config/config.yaml")
    //TODO create a test db for this
    pgCfg := cfg.Db.Development
    pg := dbc.NewPostgres(&pgCfg)
    db, err := pg.GetConn()
    if err != nil {
        return nil, err
    }

    var accessToken, channelID string
    log.Printf("Social ID: %d\n", socialID)
    err = db.DB().QueryRow(`
        SELECT oauth_token, channel_id
        FROM socials WHERE id = $1;`, 
        socialID).Scan(&accessToken, &channelID)

    if pg.IsNoResultsErr(err) {
        log.Println("No results found")
        return nil, err
    }

    var channelStatsResponse ChannelStatsResponse
    views, err := yt.GetChannelViews(accessToken, channelID)
    if err != nil {
        return nil, err
    }
    channelStatsResponse.Views = views
    subscribers, err := yt.GetChannelSubscribers(accessToken, channelID)
    if err != nil {
        return nil, err
    }
    channelStatsResponse.Subscribers = subscribers

    return &channelStatsResponse, nil

}

func (yt *Youtube) SendVideo(title string, description string, videoFilename string, socialID int, eventID int) (string, error) {
    cfg := config.LoadConfig("config/config.yaml")
    //TODO create a test db for this
    pgCfg := cfg.Db.Development
    pg := dbc.NewPostgres(&pgCfg)
    db, err := pg.GetConn()
    if err != nil {
        return "", err
    }
    // db = db.DB()

    var accessToken string
    log.Printf("Social ID: %d\n", socialID)
    err = db.DB().QueryRow(`
        SELECT oauth_token 
        FROM socials WHERE id = $1;`, 
        socialID).Scan(&accessToken)

    if pg.IsNoResultsErr(err) {
        log.Println("No results found")
        return "", err
    }

    if err != nil {
        log.Fatalf("Query Error: %v", err)
        return "", err
    }

    client := yt.BuildYoutubeClient(accessToken)
    if err != nil {
        log.Printf("Error building OAuth client: %#v", err)
        return "", err
    }

    service, err := youtube.New(client)
    if err != nil {
        log.Printf("Error creating YouTube client: %#v", err)
        return "", err
    }

    upload := &youtube.Video{
        Snippet: &youtube.VideoSnippet{
            Title:       title,
            Description: description,
            CategoryId:  "10",
        },
        Status: &youtube.VideoStatus{PrivacyStatus: "unlisted"},
    }

    call := service.Videos.Insert("snippet,status", upload)
    log.Println(videoFilename)
    videoFile, err := os.Open(videoFilename)
    defer videoFile.Close()
    if err != nil {
        log.Printf("Error opening %#v: %#v", videoFilename, err)
        return "", err
    }

    upload.Snippet.Tags = []string{"thrust"}

    resp, err := call.Media(videoFile).Do()
    if err != nil {
        log.Printf("Error making YouTube API call: %#v", err)
        return "", err
    }

    stmt, err := db.DB().Prepare(`
        UPDATE events 
        SET public_url = $1 
        WHERE id = $2`)

    if err != nil {
        return "", err
    }

    log.Printf("Response: %s\n", resp.Id)
    publicURL := fmt.Sprintf("https://www.youtube.com/watch?v=%s", resp.Id)
    _, err = stmt.Exec(publicURL, eventID)
    if err != nil {
        return "", err
    }

    return "done", err
}