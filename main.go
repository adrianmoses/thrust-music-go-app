package main

import (
	config "github.com/ammoses89/thrust-outreach/config"
	"github.com/ammoses89/thrust-outreach/controllers"
	db_ "github.com/ammoses89/thrust-outreach/db"
	"github.com/ammoses89/thrust-outreach/models"
	"github.com/martini-contrib/render"
	"github.com/go-martini/martini"
	"log"
	"net/http"
)

const WORKER_COUNT = 5

func main() {
	cfg := config.LoadConfig("config/config.yaml")
	taskMap := map[string]interface{}{
		"transcode_audio": TranscodeAudio,
		"transcode_video": TranscodeVideo,
		"social_send":     SocialSend,
		"event_send":      EventSend,
		"release_send":    ReleaseSend,
		"check_hook":      CheckHook,
		"check_social_data": CheckSocialData,
	}
	machine := NewMachine(&cfg.Redis.Development)
	db := db_.NewPostgres(&cfg.Db.Development)

	log.Println("Automigration DB")

	gormDB, err := db.GetConn()
	if err != nil {
		log.Fatalf("Unable to retrieve database connection: %v", err)
		panic(err)
	}

	gormDB.AutoMigrate(&models.User{}, &models.Artist{}, &models.Asset{},
		&models.Content{}, &models.Event{}, &models.Social{},
		&models.Storage{}, &models.Hook{}, &models.SocialAnalytics{},
		&models.Page{})

	log.Println("Registering Tasks...")
	machine.RegisterTasks(taskMap)
	log.Println("Launching Workers...")

	// launch workers in goroutine
	go func() {
		if err := machine.LaunchWorkers(WORKER_COUNT); err != nil {
			log.Fatalf("Failed to launch workers: %v", err)
			panic(err)
		}
	}()

	// launch schedulers
	// these will 
	// select create a task to select from db
	// creat task to check data for analytics
	// create task to check data for triggers

	m := martini.Classic()

	static := martini.Static("public", martini.StaticOptions{Fallback: "/index.html", Exclude: "/api/"})
	m.Use(static)
	m.Use(render.Renderer())

	m.Map(machine)
	m.Map(db)

	m.Group("/api", func(r martini.Router) {
		r.Post("/transcode/audio", CreateTranscodeAudioTask)
		r.Post("/transcode/video", CreateTranscodeVideoTask)
		r.Post("/social/send", CreateSocialSendTask)
		r.Post("/social/check", CreateCheckSocialDataTask)
		r.Post("/event/send", CreateEventSendTask)
		r.Post("/release/send", CreateReleaseSendTask)

		// artist controller
		r.Get("/artists/:id", controllers.Artists.Get)
		r.Post("/artists/:id", controllers.Artists.Save)

		// sessions controller
		r.Post("/get_token", controllers.Sessions.GetToken)
		r.Post("/is_token_valid", controllers.Sessions.IsValidToken)
		r.Post("/create_user", controllers.Sessions.Create)
		r.Get("/user", controllers.Sessions.Get)

		// events controller
		r.Get("/events/:id", controllers.Events.Get)
		r.Get("/events/generate", controllers.Events.Generate)

		// social controller
		r.Get("/social/:provider/authorize", controllers.Socials.Authorize)
		r.Get("/social/:provider/callback", controllers.Socials.Create)
		r.Get("/social/:provider/revoke", controllers.Socials.Destroy)
		r.Get("/social/queued/:artist_id/:provider", controllers.Socials.GetQueuedPosts)
		r.Get("/social/sent/:artist_id/:provider", controllers.Socials.GetSentPosts)
		r.Get("/social/all/:artist_id", controllers.Socials.GetByArtist)
		r.Get("/social/:id", controllers.Socials.Get)
		r.Post("/social/facebook/choose_page", controllers.Socials.ChooseFacebookPage)

		// content controller
		r.Post("/content/upload_image", controllers.Contents.UploadImage)
		r.Post("/content/upload_audio", controllers.Contents.UploadAudio)
		r.Post("/content/upload_video", controllers.Contents.UploadVideo)
		r.Post("/content/save", controllers.Contents.Create)

		// storage controller
		r.Get("/storage/:artist_id", controllers.Storages.All)
		r.Get("/storage/:provider/authorize", controllers.Storages.Authorize)
		r.Get("/storage/:provider/callback", controllers.Storages.Create)

		// hooks controller
		r.Get("/hook/:artist_id", controllers.Hooks.All)
		r.Get("/hook/:artist_id/:id", controllers.Hooks.Get)
		r.Post("/hook/:artist_id/new", controllers.Hooks.Create)
		r.Post("/hook/:artist_id/:id", controllers.Hooks.Save)
		r.Delete("/hook/:artist_id/:id", controllers.Hooks.Destroy)

		r.Post("/page/new", controllers.Pages.Create)
		r.Post("/page/create", controllers.Pages.Save)
	})

	m.NotFound(static, http.NotFound)
	m.Run()
}
