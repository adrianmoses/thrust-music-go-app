package main

import (
    "fmt"
    "log"
    "encoding/json"
    "io/ioutil"
    "time"
    "net/http"
    "github.com/ammoses89/thrust-outreach/models"
    "github.com/ammoses89/thrust-outreach/social"
    dbc "github.com/ammoses89/thrust-outreach/db"
    config "github.com/ammoses89/thrust-outreach/config"
)


func CreateCheckSocialDataTask(req *http.Request, machine *Machine) string {
    var payload SocialDataCheckPayload
    var msg string
    res, err := ioutil.ReadAll(req.Body)
    if err := json.Unmarshal(res, &payload); err != nil {
        fmt.Println("Could not parse JSON: %v", err)
    }

    metadata, err := json.Marshal(payload)

    if err != nil {
        msg  = fmt.Sprintf("Error ocurred: %v", err)
        return fmt.Sprintf("{\"error\": %s \"status\": 500}", msg)
    }

    task := NewTask("check_social_data", string(metadata))
    duration, err := time.ParseDuration("10m")
    if err != nil {
        msg  = fmt.Sprintf("Error ocurred: %v", err)
        return fmt.Sprintf("{\"error\": %s \"status\": 500}", msg)
    }
    task.RunEvery = duration
    task.RunAt = time.Now().Add(task.RunEvery)
    machine.SendTask(task)
    return "{\"status\": 200}"
}

func CheckSocialData(task *Task) (bool, error) {
    var payload SocialDataCheckPayload
    err := task.DeserializeMetadata(&payload)
    if err != nil {
        log.Printf("Failed to deserialize payload: %+v", err)
        return false, err
    }

    var analyticsModels []models.SocialAnalytics

    switch payload.Provider {
    case "twitter":
        twit := social.MakeTwitter()
        userTimeline, _ := twit.GetStats(payload.SocialID)

        followersModel := models.SocialAnalytics{Metric: "followers",
            MetricValue: int64(userTimeline.User.FollowersCount),
            SocialID: payload.SocialID,
            EntryDate: time.Now(),
            Provider: "twitter",
            ArtistID: payload.ArtistID}
        analyticsModels = append(analyticsModels, followersModel)

        retweetsModel := models.SocialAnalytics{Metric: "retweets",
            MetricValue: int64(userTimeline.RetweetedStatus.RetweetCount),
            SocialID: payload.SocialID,
            EntryDate: time.Now(),
            Provider: "twitter",
            ArtistID: payload.ArtistID}
        analyticsModels = append(analyticsModels, retweetsModel)
        
        mentionsModel := models.SocialAnalytics{Metric: "mentions",
            MetricValue: int64(len(userTimeline.Entities.UserMentions)),
            SocialID: payload.SocialID,
            EntryDate: time.Now(),
            Provider: "twitter",
            ArtistID: payload.ArtistID}
        analyticsModels = append(analyticsModels, mentionsModel)
        
    case "facebook":
        facebook := social.MakeFacebook()
        pageStats, _ := facebook.GetPageStats(payload.SocialID)

        pageViews := pageStats[0]
        if pageViews != nil {
            pageViewsModel := models.SocialAnalytics{Metric: "views",
                MetricValue: int64(pageViews.Data[0].Values[0].Value),
                SocialID: payload.SocialID,
                EntryDate: time.Now(),
                Provider: "facebook",
                ArtistID: payload.ArtistID}

            analyticsModels = append(analyticsModels, pageViewsModel)
        }

        pageFans := pageStats[1]

        if pageFans != nil {
            pageFansModel := models.SocialAnalytics{Metric: "fans",
                MetricValue: int64(pageFans.Data[0].Values[0].Value),
                SocialID: payload.SocialID,
                EntryDate: time.Now(),
                Provider: "facebook",
                ArtistID: payload.ArtistID}

            analyticsModels = append(analyticsModels, pageFansModel)
        }

        pageEngagement := pageStats[2]

        if pageEngagement != nil {
            pageEngagementModel := models.SocialAnalytics{Metric: "engagement",
                MetricValue: int64(pageEngagement.Data[0].Values[0].Value),
                SocialID: payload.SocialID,
                EntryDate: time.Now(),
                Provider: "facebook",
                ArtistID: payload.ArtistID}

            analyticsModels = append(analyticsModels, pageEngagementModel)
        }


    case "youtube":
        youtube := social.MakeYoutube()
        channelStats, _ := youtube.GetChannelStats(payload.SocialID)
        if channelStats.Views != 0 {

            channelViewsModel := models.SocialAnalytics{Metric: "views",
                MetricValue: int64(channelStats.Views),
                SocialID: payload.SocialID,
                EntryDate: time.Now(),
                Provider: "youtube",
                ArtistID: payload.ArtistID}

            analyticsModels = append(analyticsModels, channelViewsModel)
        }

        if channelStats.Subscribers != 0 {

            channelSubscribersModels := models.SocialAnalytics{Metric: "subscribers",
                MetricValue: int64(channelStats.Subscribers),
                SocialID: payload.SocialID,
                EntryDate: time.Now(),
                Provider: "youtube",
                ArtistID: payload.ArtistID}

            analyticsModels = append(analyticsModels, channelSubscribersModels)
        }

    default:
        log.Printf("Provider %s not supported for Social Check Task", payload.Provider)
    }

    // add filename to database
    cfg := config.LoadConfig("config/config.yaml")
    pgCfg := cfg.Db.Development
    pg := dbc.NewPostgres(&pgCfg)
    db, err := pg.GetConn()
    if err != nil {
        return false, err
    }

    // TODO: bulk insert analytics models
    for _, analyticsModel := range analyticsModels {
        db.Create(&analyticsModel)
        // TODO check if record is success
    }
    return true, nil
}