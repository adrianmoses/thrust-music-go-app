package files

import (
    "log"
    "io/ioutil"
    "mime/multipart"
    "cloud.google.com/go/storage"
    "golang.org/x/net/context"
    "google.golang.org/api/option"
)


func UploadToGCS(filename string, urlPath string) int {
    ctx := context.Background()

    // set a project ID
    // projectID := "thrust"
    client, err := storage.NewClient(ctx, option.WithServiceAccountFile("thrust-5f3eaea7e015.json"))
    if err != nil {
        log.Fatalf("Failed to create client: %v", err)
    }

    // Set bucket name
    bucketName := "thrust-media"

    // Create bucket instance
    bucket := client.Bucket(bucketName)
    object := bucket.Object(urlPath)

    // create reader
    wc := object.NewWriter(ctx)
    wc.ACL = []storage.ACLRule{{Entity: storage.AllUsers, Role: storage.RoleReader}}
    wc.CacheControl = "public, max-age=86400"
    
    data, err := ioutil.ReadFile(filename)
    if _, err := wc.Write(data); err != nil {
        log.Printf("Failed to write file: %v", err) 
    }

    if err := wc.Close(); err != nil {
        log.Printf("Failed to save file: %v", err) 
    }

    return 1
}

func WriteToGCS(file multipart.File, urlPath string) int {
    ctx := context.Background()

    // set a project ID
    // projectID := "thrust"
    client, err := storage.NewClient(ctx, option.WithServiceAccountFile("thrust-5f3eaea7e015.json"))
    if err != nil {
        log.Fatalf("Failed to create client: %v", err)
    }

    // Set bucket name
    bucketName := "thrust-media"

    // Create bucket instance
    bucket := client.Bucket(bucketName)
    object := bucket.Object(urlPath)

    // create reader
    wc := object.NewWriter(ctx)
    wc.ACL = []storage.ACLRule{{Entity: storage.AllUsers, Role: storage.RoleReader}}
    wc.CacheControl = "public, max-age=86400"
    data, err := ioutil.ReadAll(file)
    if _, err := wc.Write(data); err != nil {
        log.Printf("Failed to write file: %v", err) 
    }

    if err := wc.Close(); err != nil {
        log.Printf("Failed to save file: %v", err) 
    }

    return 1
}