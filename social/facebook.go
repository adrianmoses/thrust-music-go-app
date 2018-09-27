package social

import (
    config "github.com/ammoses89/thrust-outreach/config"
    dbc "github.com/ammoses89/thrust-outreach/db"
    "encoding/json"
    "errors"
    "io/ioutil"
    "net/http"
    "os"
    "time"
    "net/url"
    "bufio"
    "fmt"
    "log"
    "golang.org/x/oauth2"
)

type FacebookPage struct {
    Id string `json:"id"`
    AccessToken string `json:"access_token"`
    Name string `json:"name"`
    Category string `json:"category"`
    Perms []string `json:"perms"`
}

type FacebookPages struct {
    Data []FacebookPage `json:"data"`
}

type FacebookPageProfileSource struct {
    URL string `json:"url"`
}

type FacebookPageProfileResponse struct {
    Data FacebookPageProfileSource `json:"data"`
}

type PagingLinks struct {
    Previous string `json:"previous"`
    Next string `json:"next"`
}

type FacebookPageStat struct {
    EndTime time.Time `json:"end_time"`
    Value int `json:"value"`
}

type FacebookPageStats struct  {
    Name string `json:"name"`
    Period int `json:"period"`
    Title string `json:"title"`
    Values []FacebookPageStat `json:"values"`
}

type FacebookPageStatsResponse struct {
    Data []FacebookPageStats `json:"data"`
    Paging PagingLinks `json:"paging"`
}

const FacebookURL = "https://graph.facebook.com"

type Facebook struct {
    conf *oauth2.Config
}

func MakeFacebook() *Facebook {
    cfg := config.LoadConfig("config/config.yaml")
    config := &oauth2.Config{
        ClientID:     cfg.Facebook.ClientID,
        ClientSecret: cfg.Facebook.ClientSecret,
        Endpoint: oauth2.Endpoint{
            AuthURL:  "https://www.facebook.com/dialog/oauth",
            TokenURL: "https://graph.facebook.com/oauth/access_token",
        },
        RedirectURL: "http://localhost:3000/api/social/facebook/callback",
        Scopes: []string{"public_profile", "pages_show_list", "manage_pages", "read_insights"},
    }

    return &Facebook{
        conf: config} 
}

func (facebook *Facebook) GetAuthorizeURL(jwtToken string) string {
    oauth2RedirectURI := oauth2.SetAuthURLParam("redirect_uri", "http://localhost:3000/api/social/facebook/callback")
    oauth2ResponseType := oauth2.SetAuthURLParam("response_type", "code")
    url := facebook.conf.AuthCodeURL(jwtToken, oauth2RedirectURI, oauth2ResponseType)
    return url
}

func (facebook *Facebook) ExchangeCodeForToken(code string) (*oauth2.Token, error) {
    token, err := facebook.conf.Exchange(oauth2.NoContext, code)
    if err != nil {
        log.Printf("Unable to retrieve token from web %v", err)
        return nil, err
    }
    return token, nil
}

func (facebook *Facebook) BuildFacebookClient(accessToken string) *http.Client {
    config := facebook.conf
    return config.Client(oauth2.NoContext, &oauth2.Token{AccessToken: accessToken})
}


func (facebook *Facebook) GetFacebookPages(accessToken string) *FacebookPages {
    getPagesURL := fmt.Sprintf("https://graph.facebook.com/me/accounts?access_token=%s", accessToken)
    client := http.Client{}

    req, err := http.NewRequest(http.MethodGet, getPagesURL, nil)
    if err != nil {
        log.Printf("Request Error: %+v", err)
    }

    res, err := client.Do(req)
    if err != nil {
        log.Printf("Error: %v", err)
    }

    decoder := json.NewDecoder(res.Body)
    var facebookPages FacebookPages
    err = decoder.Decode(&facebookPages)
    if err != nil {
        log.Printf("Decoding Error: %v", err)
    }

    return &facebookPages 
}

func (facebook *Facebook) GetPagePicture(accessToken string, pageId int64) string {
    pagesURL := fmt.Sprintf("https://graph.facebook.com/%d/picture?fields=url&access_token=%s", pageId, accessToken)
    // client := facebook.BuildFacebookClient(accessToken)
    // // client := http.Client{}

    // req, err := http.NewRequest(http.MethodGet, pagesURL, nil)
    // if err != nil {
    //     log.Printf("Request Error: %+v", err)
    // }

    // res, err := client.Do(req)
    // if err != nil {
    //     log.Printf("Error: %v\n", err)
    // }
    // body, _ := ioutil.ReadAll(res.Body)
    // log.Printf("Body: %s\n", string(body))

    // decoder := json.NewDecoder(res.Body)
    // var facebookProfileResponse FacebookPageProfileResponse
    // err = decoder.Decode(&facebookProfileResponse)
    // if err != nil {
    //     log.Printf("Decoding Error: %#v", err)
    // }

    // return facebookProfileResponse.Data.URL
    return pagesURL
}

func (facebook *Facebook) GetPageViews(accessToken string, pageId int64) *FacebookPageStatsResponse {
    // https://developers.facebook.com/docs/graph-api/reference/v2.10/insights
    pagesURL := fmt.Sprintf("https://graph.facebook.com/%d/insights?metric=page_views_total&date_preset=today&access_token=%s", pageId, accessToken)
    
    client := facebook.BuildFacebookClient(accessToken)
    // client := http.Client{}

    req, err := http.NewRequest(http.MethodGet, pagesURL, nil)
    if err != nil {
        log.Printf("Request Error: %+v", err)
    }

    res, err := client.Do(req)
    if err != nil {
        log.Printf("Error: %v\n", err)
    }
    body, _ := ioutil.ReadAll(res.Body)
    log.Printf("Body: %s\n", string(body))

    var fbResponse FacebookPageStatsResponse
    err = json.Unmarshal(body, &fbResponse)
    if err != nil {
        log.Printf("Error: %v", err)
    }

    return &fbResponse
}

func (facebook *Facebook) GetPageFans(accessToken string, pageId int64) *FacebookPageStatsResponse {
    // https://developers.facebook.com/docs/graph-api/reference/v2.10/insights
    pagesURL := fmt.Sprintf("https://graph.facebook.com/%d/insights?metric=page_fan_adds&date_preset=today&access_token=%s", pageId, accessToken)
    
    client := facebook.BuildFacebookClient(accessToken)
    // client := http.Client{}

    req, err := http.NewRequest(http.MethodGet, pagesURL, nil)
    if err != nil {
        log.Printf("Request Error: %+v", err)
    }

    res, err := client.Do(req)
    if err != nil {
        log.Printf("Error: %v\n", err)
    }
    body, _ := ioutil.ReadAll(res.Body)
    log.Printf("Body: %s\n", string(body))

    var fbResponse FacebookPageStatsResponse
    err = json.Unmarshal(body, &fbResponse)
    if err != nil {
        log.Printf("Error: %v", err)
    }

    return &fbResponse
}

func (facebook *Facebook) GetPageEngagement(accessToken string, pageId int64) *FacebookPageStatsResponse {
    // https://developers.facebook.com/docs/graph-api/reference/v2.10/insights
    pagesURL := fmt.Sprintf("https://graph.facebook.com/%d/insights?metric=page_engaged_users&date_preset=today&access_token=%s", pageId, accessToken)
    
    client := facebook.BuildFacebookClient(accessToken)
    // client := http.Client{}

    req, err := http.NewRequest(http.MethodGet, pagesURL, nil)
    if err != nil {
        log.Printf("Request Error: %+v", err)
    }

    res, err := client.Do(req)
    if err != nil {
        log.Printf("Error: %v\n", err)
    }
    body, _ := ioutil.ReadAll(res.Body)
    log.Printf("Body: %s\n", string(body))

    var fbResponse FacebookPageStatsResponse
    err = json.Unmarshal(body, &fbResponse)
    if err != nil {
        log.Printf("Error: %v", err)
    }

    return &fbResponse

}

func (facebook *Facebook) GetPageStats(socialID int) ([]*FacebookPageStatsResponse, error) {
    cfg := config.LoadConfig("config/config.yaml")
    //TODO create a test db for this
    pgCfg := cfg.Db.Development
    pg := dbc.NewPostgres(&pgCfg)
    db, err := pg.GetConn()
    if err != nil {
        return nil, err
    }
    // db = db.DB()

    var accessToken string
    var pageID int
    err = db.DB().QueryRow(`
        SELECT oauth_token, page_id 
        FROM socials WHERE id = $1`, 
        socialID).Scan(&accessToken, &pageID)

    if pg.IsNoResultsErr(err) {
        log.Println("No results found")
        return nil, err
    }

    var fbResponses []*FacebookPageStatsResponse
    pageID64 := int64(pageID)
    views := facebook.GetPageViews(accessToken, pageID64)
    fbResponses = append(fbResponses, views)

    fans := facebook.GetPageFans(accessToken, pageID64)
    fbResponses = append(fbResponses, fans)

    engagement := facebook.GetPageEngagement(accessToken, pageID64)
    fbResponses = append(fbResponses, engagement)

    return fbResponses, nil

}

func (facebook *Facebook) SendMessage(message string, socialID int, eventID int, mediaFilename string) (string, error) {

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
    var pageID int
    err = db.DB().QueryRow(`
        SELECT oauth_token, page_id 
        FROM socials WHERE id = $1`, 
        socialID).Scan(&accessToken, &pageID)

    if pg.IsNoResultsErr(err) {
        log.Println("No results found")
        return "", err
    }

    if pageID == 0 {
        return "", errors.New("No page id found")
    }

    endpoint := fmt.Sprintf(FacebookURL, "/", pageID, "/", "feed")
    params := url.Values{"message": []string{message},
                         "access_token": []string{accessToken}}
    resp, err := http.PostForm(endpoint, params) 

    if err != nil {
        log.Fatalf("Failed to send: %v", err)
        return "", err
    }
    defer resp.Body.Close()
    // what to do with body?
    body, err := ioutil.ReadAll(resp.Body)
    log.Printf("Response: %s\n", body)
    return string(body), err
}

func (facebook *Facebook) SendVideo(videoUrl string, videoFilename string, socialID int) (string, error) {

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
    var pageID int
    err = db.DB().QueryRow(`
        SELECT access_token, page_id 
        FROM socials WHERE id = $1`, 
        socialID).Scan(&accessToken, &pageID)

    if pg.IsNoResultsErr(err) {
        log.Println("No results found")
        return "", err
    }

    if pageID == 0 {
        return "", errors.New("No page id found")
    }

    filePtr, err := os.Open(videoFilename)

    if err != nil {
        log.Printf("Failed to open file: %v", err)
        return "", err
    }


    buf := bufio.NewReader(filePtr)

    if err != nil {
        log.Print("Failed to read file: %v", err)
        return "", err
    }

    params := url.Values{"access_token": []string{accessToken}}
    endpoint := fmt.Sprintf(FacebookURL, "/", pageID, "/", "videos", params.Encode())
    resp, err := http.Post(endpoint, "video/mp4", buf) 

    if err != nil {
        log.Fatalf("Failed to send: %v", err)
        return "", err
    }
    defer resp.Body.Close()
    // what to do with body?
    body, err := ioutil.ReadAll(resp.Body)
    log.Printf("Response: %s\n", body)
    return string(body), err
}