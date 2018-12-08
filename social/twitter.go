package social

/*
Here will be all the logic for making twitter API calls
We'll use a struct to make sure all the necessary componens are
supplied.
This will also provide flexibility
*/

import (
    "fmt"
    "log"
    "net/http"
    "net/url"
    "io/ioutil"
    "encoding/json"
    config "github.com/ammoses89/thrust/config"
    dbc "github.com/ammoses89/thrust/db"
    "github.com/dghubble/oauth1"
    twit "github.com/dghubble/oauth1/twitter"
)

const TwitterURL = "https://api.twitter.com/1.1"

type Twitter struct {
    ConsumerKey string
    ConsumerSecret string
    conf oauth1.Config
}

type StatusResponse struct {
    CreatedAt string `json:"created_at"`
    ID        int64  `json:"id"`
    IDStr     string `json:"id_str"`
    ScreenName string `json:"screen_name"`
}

type UserTimelineResponse struct {
    CreatedAt string `json:"created_at"`
    ID        int64  `json:"id"`
    IDStr     string `json:"id_str"`
    Text      string `json:"text"`
    Truncated bool   `json:"truncated"`
    Entities  struct {
        Hashtags     []interface{} `json:"hashtags"`
        Symbols      []interface{} `json:"symbols"`
        UserMentions []struct {
            ScreenName string `json:"screen_name"`
            Name       string `json:"name"`
            ID         int    `json:"id"`
            IDStr      string `json:"id_str"`
            Indices    []int  `json:"indices"`
        } `json:"user_mentions"`
        Urls []interface{} `json:"urls"`
    } `json:"entities"`
    Source               string      `json:"source"`
    InReplyToStatusID    interface{} `json:"in_reply_to_status_id"`
    InReplyToStatusIDStr interface{} `json:"in_reply_to_status_id_str"`
    InReplyToUserID      interface{} `json:"in_reply_to_user_id"`
    InReplyToUserIDStr   interface{} `json:"in_reply_to_user_id_str"`
    InReplyToScreenName  interface{} `json:"in_reply_to_screen_name"`
    User                 struct {
        ID          int    `json:"id"`
        IDStr       string `json:"id_str"`
        Name        string `json:"name"`
        ScreenName  string `json:"screen_name"`
        Location    string `json:"location"`
        Description string `json:"description"`
        URL         string `json:"url"`
        Entities    struct {
            URL struct {
                Urls []struct {
                    URL         string `json:"url"`
                    ExpandedURL string `json:"expanded_url"`
                    DisplayURL  string `json:"display_url"`
                    Indices     []int  `json:"indices"`
                } `json:"urls"`
            } `json:"url"`
            Description struct {
                Urls []interface{} `json:"urls"`
            } `json:"description"`
        } `json:"entities"`
        Protected                      bool   `json:"protected"`
        FollowersCount                 int    `json:"followers_count"`
        FriendsCount                   int    `json:"friends_count"`
        ListedCount                    int    `json:"listed_count"`
        CreatedAt                      string `json:"created_at"`
        FavouritesCount                int    `json:"favourites_count"`
        UtcOffset                      int    `json:"utc_offset"`
        TimeZone                       string `json:"time_zone"`
        GeoEnabled                     bool   `json:"geo_enabled"`
        Verified                       bool   `json:"verified"`
        StatusesCount                  int    `json:"statuses_count"`
        Lang                           string `json:"lang"`
        ContributorsEnabled            bool   `json:"contributors_enabled"`
        IsTranslator                   bool   `json:"is_translator"`
        IsTranslationEnabled           bool   `json:"is_translation_enabled"`
        ProfileBackgroundColor         string `json:"profile_background_color"`
        ProfileBackgroundImageURL      string `json:"profile_background_image_url"`
        ProfileBackgroundImageURLHTTPS string `json:"profile_background_image_url_https"`
        ProfileBackgroundTile          bool   `json:"profile_background_tile"`
        ProfileImageURL                string `json:"profile_image_url"`
        ProfileImageURLHTTPS           string `json:"profile_image_url_https"`
        ProfileBannerURL               string `json:"profile_banner_url"`
        ProfileLinkColor               string `json:"profile_link_color"`
        ProfileSidebarBorderColor      string `json:"profile_sidebar_border_color"`
        ProfileSidebarFillColor        string `json:"profile_sidebar_fill_color"`
        ProfileTextColor               string `json:"profile_text_color"`
        ProfileUseBackgroundImage      bool   `json:"profile_use_background_image"`
        HasExtendedProfile             bool   `json:"has_extended_profile"`
        DefaultProfile                 bool   `json:"default_profile"`
        DefaultProfileImage            bool   `json:"default_profile_image"`
        Following                      bool   `json:"following"`
        FollowRequestSent              bool   `json:"follow_request_sent"`
        Notifications                  bool   `json:"notifications"`
        TranslatorType                 string `json:"translator_type"`
    } `json:"user"`
    Geo             interface{} `json:"geo"`
    Coordinates     interface{} `json:"coordinates"`
    Place           interface{} `json:"place"`
    Contributors    interface{} `json:"contributors"`
    RetweetedStatus struct {
        CreatedAt string `json:"created_at"`
        ID        int64  `json:"id"`
        IDStr     string `json:"id_str"`
        Text      string `json:"text"`
        Truncated bool   `json:"truncated"`
        Entities  struct {
            Hashtags     []interface{} `json:"hashtags"`
            Symbols      []interface{} `json:"symbols"`
            UserMentions []interface{} `json:"user_mentions"`
            Urls         []struct {
                URL         string `json:"url"`
                ExpandedURL string `json:"expanded_url"`
                DisplayURL  string `json:"display_url"`
                Indices     []int  `json:"indices"`
            } `json:"urls"`
        } `json:"entities"`
        Source               string      `json:"source"`
        InReplyToStatusID    interface{} `json:"in_reply_to_status_id"`
        InReplyToStatusIDStr interface{} `json:"in_reply_to_status_id_str"`
        InReplyToUserID      interface{} `json:"in_reply_to_user_id"`
        InReplyToUserIDStr   interface{} `json:"in_reply_to_user_id_str"`
        InReplyToScreenName  interface{} `json:"in_reply_to_screen_name"`
        User                 struct {
            ID          int    `json:"id"`
            IDStr       string `json:"id_str"`
            Name        string `json:"name"`
            ScreenName  string `json:"screen_name"`
            Location    string `json:"location"`
            Description string `json:"description"`
            URL         string `json:"url"`
            Entities    struct {
                URL struct {
                    Urls []struct {
                        URL         string `json:"url"`
                        ExpandedURL string `json:"expanded_url"`
                        DisplayURL  string `json:"display_url"`
                        Indices     []int  `json:"indices"`
                    } `json:"urls"`
                } `json:"url"`
                Description struct {
                    Urls []interface{} `json:"urls"`
                } `json:"description"`
            } `json:"entities"`
            Protected                      bool   `json:"protected"`
            FollowersCount                 int    `json:"followers_count"`
            FriendsCount                   int    `json:"friends_count"`
            ListedCount                    int    `json:"listed_count"`
            CreatedAt                      string `json:"created_at"`
            FavouritesCount                int    `json:"favourites_count"`
            UtcOffset                      int    `json:"utc_offset"`
            TimeZone                       string `json:"time_zone"`
            GeoEnabled                     bool   `json:"geo_enabled"`
            Verified                       bool   `json:"verified"`
            StatusesCount                  int    `json:"statuses_count"`
            Lang                           string `json:"lang"`
            ContributorsEnabled            bool   `json:"contributors_enabled"`
            IsTranslator                   bool   `json:"is_translator"`
            IsTranslationEnabled           bool   `json:"is_translation_enabled"`
            ProfileBackgroundColor         string `json:"profile_background_color"`
            ProfileBackgroundImageURL      string `json:"profile_background_image_url"`
            ProfileBackgroundImageURLHTTPS string `json:"profile_background_image_url_https"`
            ProfileBackgroundTile          bool   `json:"profile_background_tile"`
            ProfileImageURL                string `json:"profile_image_url"`
            ProfileImageURLHTTPS           string `json:"profile_image_url_https"`
            ProfileBannerURL               string `json:"profile_banner_url"`
            ProfileLinkColor               string `json:"profile_link_color"`
            ProfileSidebarBorderColor      string `json:"profile_sidebar_border_color"`
            ProfileSidebarFillColor        string `json:"profile_sidebar_fill_color"`
            ProfileTextColor               string `json:"profile_text_color"`
            ProfileUseBackgroundImage      bool   `json:"profile_use_background_image"`
            HasExtendedProfile             bool   `json:"has_extended_profile"`
            DefaultProfile                 bool   `json:"default_profile"`
            DefaultProfileImage            bool   `json:"default_profile_image"`
            Following                      bool   `json:"following"`
            FollowRequestSent              bool   `json:"follow_request_sent"`
            Notifications                  bool   `json:"notifications"`
            TranslatorType                 string `json:"translator_type"`
        } `json:"user"`
        Geo               interface{} `json:"geo"`
        Coordinates       interface{} `json:"coordinates"`
        Place             interface{} `json:"place"`
        Contributors      interface{} `json:"contributors"`
        IsQuoteStatus     bool        `json:"is_quote_status"`
        RetweetCount      int         `json:"retweet_count"`
        FavoriteCount     int         `json:"favorite_count"`
        Favorited         bool        `json:"favorited"`
        Retweeted         bool        `json:"retweeted"`
        PossiblySensitive bool        `json:"possibly_sensitive"`
        Lang              string      `json:"lang"`
    } `json:"retweeted_status"`
    IsQuoteStatus bool   `json:"is_quote_status"`
    RetweetCount  int    `json:"retweet_count"`
    FavoriteCount int    `json:"favorite_count"`
    Favorited     bool   `json:"favorited"`
    Retweeted     bool   `json:"retweeted"`
    Lang          string `json:"lang"`
}

type UserVerifyResponse struct {
    ContributorsEnabled            bool        `json:"contributors_enabled"`
    CreatedAt                      string      `json:"created_at"`
    DefaultProfile                 bool        `json:"default_profile"`
    DefaultProfileImage            bool        `json:"default_profile_image"`
    Description                    string      `json:"description"`
    FavouritesCount                int         `json:"favourites_count"`
    FollowRequestSent              interface{} `json:"follow_request_sent"`
    FollowersCount                 int         `json:"followers_count"`
    Following                      interface{} `json:"following"`
    FriendsCount                   int         `json:"friends_count"`
    GeoEnabled                     bool        `json:"geo_enabled"`
    ID                             int         `json:"id"`
    IDStr                          string      `json:"id_str"`
    IsTranslator                   bool        `json:"is_translator"`
    Lang                           string      `json:"lang"`
    ListedCount                    int         `json:"listed_count"`
    Location                       string      `json:"location"`
    Name                           string      `json:"name"`
    Notifications                  interface{} `json:"notifications"`
    ProfileBackgroundColor         string      `json:"profile_background_color"`
    ProfileBackgroundImageURL      string      `json:"profile_background_image_url"`
    ProfileBackgroundImageURLHTTPS string      `json:"profile_background_image_url_https"`
    ProfileBackgroundTile          bool        `json:"profile_background_tile"`
    ProfileImageURL                string      `json:"profile_image_url"`
    ProfileImageURLHTTPS           string      `json:"profile_image_url_https"`
    ProfileLinkColor               string      `json:"profile_link_color"`
    ProfileSidebarBorderColor      string      `json:"profile_sidebar_border_color"`
    ProfileSidebarFillColor        string      `json:"profile_sidebar_fill_color"`
    ProfileTextColor               string      `json:"profile_text_color"`
    ProfileUseBackgroundImage      bool        `json:"profile_use_background_image"`
    Protected                      bool        `json:"protected"`
    ScreenName                     string      `json:"screen_name"`
    ShowAllInlineMedia             bool        `json:"show_all_inline_media"`
    Status                         struct {
        Contributors interface{} `json:"contributors"`
        Coordinates  struct {
            Coordinates []float64 `json:"coordinates"`
            Type        string    `json:"type"`
        } `json:"coordinates"`
        CreatedAt string `json:"created_at"`
        Favorited bool   `json:"favorited"`
        Geo       struct {
            Coordinates []float64 `json:"coordinates"`
            Type        string    `json:"type"`
        } `json:"geo"`
        ID                   int64  `json:"id"`
        IDStr                string `json:"id_str"`
        InReplyToScreenName  string `json:"in_reply_to_screen_name"`
        InReplyToStatusID    int64  `json:"in_reply_to_status_id"`
        InReplyToStatusIDStr string `json:"in_reply_to_status_id_str"`
        InReplyToUserID      int    `json:"in_reply_to_user_id"`
        InReplyToUserIDStr   string `json:"in_reply_to_user_id_str"`
        Place                struct {
            Attributes struct {
            } `json:"attributes"`
            BoundingBox struct {
                Coordinates [][][]float64 `json:"coordinates"`
                Type        string        `json:"type"`
            } `json:"bounding_box"`
            Country     string `json:"country"`
            CountryCode string `json:"country_code"`
            FullName    string `json:"full_name"`
            ID          string `json:"id"`
            Name        string `json:"name"`
            PlaceType   string `json:"place_type"`
            URL         string `json:"url"`
        } `json:"place"`
        RetweetCount int    `json:"retweet_count"`
        Retweeted    bool   `json:"retweeted"`
        Source       string `json:"source"`
        Text         string `json:"text"`
        Truncated    bool   `json:"truncated"`
    } `json:"status"`
    StatusesCount int         `json:"statuses_count"`
    TimeZone      string      `json:"time_zone"`
    URL           interface{} `json:"url"`
    UtcOffset     int         `json:"utc_offset"`
    Verified      bool        `json:"verified"`
}

func MakeTwitter() *Twitter {
    cfg := config.LoadConfig("config/config.yaml")
    config := oauth1.Config{
        ConsumerKey: cfg.Twitter.ConsumerKey, 
        ConsumerSecret: cfg.Twitter.ConsumerSecret,
        CallbackURL:    "http://localhost:3000/api/social/twitter/callback",
        Endpoint:       twit.AuthorizeEndpoint,
    }

    return &Twitter{
        ConsumerKey: cfg.Twitter.ConsumerKey, 
        ConsumerSecret: cfg.Twitter.ConsumerSecret,
        conf: config} 
}

func (twitter *Twitter) GetAuthorizeURL(jwtToken string) string {
    twitter.conf.CallbackURL += fmt.Sprintf("?state=%s", jwtToken)
    requestToken, _, err := twitter.conf.RequestToken()
    if err !=  nil {
        log.Printf("Error occured when requesting token: %v", err)
    }
    authorizationURL, err := twitter.conf.AuthorizationURL(requestToken)
    if err !=  nil {
        log.Printf("Error occured when requesting token: %v", err)
    }
    // q := authorizationURL.Query()
    // log.Println(jwtToken)
    // q.Set("state", jwtToken)
    // authorizationURL.RawQuery = q.Encode()
    log.Println(authorizationURL.String())
    return authorizationURL.String()
}

func (twitter *Twitter) ExchangeRequestForToken(req *http.Request) (*oauth1.Token, error) {
    requestToken, verifier, err := oauth1.ParseAuthorizationCallback(req)
    if err != nil {
        log.Printf("Unable to retrieve token from web %v", err)
        return nil, err
    }
    accessToken, accessSecret, err := twitter.conf.AccessToken(requestToken, "thrust-rules", verifier)
    if err != nil {
        log.Printf("Unable to retrieve token from web %v", err)
        return nil, err
    }
    token := oauth1.NewToken(accessToken, accessSecret)
    return token, nil
}

func (twitter *Twitter) BuildTwitterClient(userAccessToken string, userTokenSecret string) *http.Client {
    clientCfg := oauth1.NewConfig(twitter.ConsumerKey, twitter.ConsumerSecret)
    token := oauth1.NewToken(userAccessToken, userTokenSecret)
    // httpClient will automatically authorize http.Request's
    httpClient := clientCfg.Client(oauth1.NoContext, token)
    return httpClient
}

func (twitter *Twitter) GetUserProfile(userAccessToken string, userTokenSecret string) *UserVerifyResponse {
    client := twitter.BuildTwitterClient(userAccessToken, userTokenSecret)
    path := "https://api.twitter.com/1.1/account/verify_credentials.json"
    fmt.Printf("%s\n", path)
    resp, _ := client.Get(path)
    defer resp.Body.Close()
    body, _ := ioutil.ReadAll(resp.Body)
    fmt.Printf("%s\n", string(body))
    var userVerify UserVerifyResponse
    err := json.Unmarshal(body, &userVerify)
    if err != nil {
        log.Printf("Error: %v", err)
    }

    return &userVerify
}

func (twitter *Twitter) GetUserTimeline(userAccessToken string, userTokenSecret string) *UserTimelineResponse {
    client := twitter.BuildTwitterClient(userAccessToken, userTokenSecret)
    path := "https://api.twitter.com/1.1/statuses/user_timeline.json" 
    fmt.Printf("%s\n", path)
    resp, _ := client.Get(path)
    defer resp.Body.Close()
    body, _ := ioutil.ReadAll(resp.Body)
    fmt.Printf("%s\n", string(body))
    var userTimeline UserTimelineResponse
    err := json.Unmarshal(body, &userTimeline)
    if err != nil {
        log.Printf("Error: %v", err)
    }

    return &userTimeline
}

func (twitter *Twitter) GetStats(socialID int) (*UserTimelineResponse, error) {
    // add filename to database
    cfg := config.LoadConfig("config/config.yaml")
    //TODO create a test db for this
    pgCfg := cfg.Db.Development
    pg := dbc.NewPostgres(&pgCfg)
    db, err := pg.GetConn()
    if err != nil {
        return nil, err
    }

    var accessToken, tokenSecret string
    err = db.DB().QueryRow(`
        SELECT oauth_token, token_secret 
        FROM socials WHERE id = $1`, 
        socialID).Scan(&accessToken, &tokenSecret)

    if pg.IsNoResultsErr(err) {
        log.Println("No results found")
        return nil, err
    }

    userTimeline := twitter.GetUserTimeline(accessToken, tokenSecret)
    return userTimeline, nil
}

func (twitter *Twitter) SendMessage(message string, socialID int, eventID int, mediaFilename string) (string, error) {
    // add filename to database
    cfg := config.LoadConfig("config/config.yaml")
    //TODO create a test db for this
    pgCfg := cfg.Db.Development
    pg := dbc.NewPostgres(&pgCfg)
    db, err := pg.GetConn()
    if err != nil {
        return "", err
    }
    
    endpoint := fmt.Sprintf("%s%s", TwitterURL, "/statuses/update.json")
    var accessToken, tokenSecret string
    err = db.DB().QueryRow(`
        SELECT oauth_token, token_secret 
        FROM socials WHERE id = $1`, 
        socialID).Scan(&accessToken, &tokenSecret)

    if pg.IsNoResultsErr(err) {
        log.Println("No results found")
        return "", err
    }

    httpClient := twitter.BuildTwitterClient(accessToken, tokenSecret)

    status := url.Values{"status": {message}}
    resp, err := httpClient.PostForm(endpoint, status) 

    if err != nil {
        log.Printf("Failed to send: %v", err)
        return "", err
    }
    defer resp.Body.Close()
    // what to do with body?
    body, err := ioutil.ReadAll(resp.Body)
    log.Printf("Response: %s\n", body)
    var statusResponse StatusResponse
    json.Unmarshal(body, &statusResponse)

    stmt, err := db.DB().Prepare(`
        UPDATE events 
        SET public_url = $1 
        WHERE id = $2`)

    if err != nil {
        return "", err
    }

    publicURL := fmt.Sprintf("https://twitter.com/%s/status/%s", 
        statusResponse.ScreenName, statusResponse.IDStr)
    _, err = stmt.Exec(publicURL, eventID)
    if err != nil {
        return "", err
    }
    return string(body), err
}