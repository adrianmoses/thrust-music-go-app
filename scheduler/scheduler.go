package scheduler

/*
The Scheduler Using Constraint Satisfactoin
To find the most optimal time to schedule posts and reposts

@Domains:
    - Times of Day
    - Content 

@Variables:
    - Days of the weekd (0, 1, 2, 3, 4, 5, 6, 7)

@Constraints:
    - Content can't be posted two consecutive days
    - Posts should be a specific time apart

*/

type PostEvent struct {
    PostID int `json:"post_id"`
    PostAt time.Time `json:"post_at"`
}

type Day struct {
    PostEvents []*PostEvent `json:"post_events"`
}

type Scheduler struct {
    Days []Day `json:"days"`
    PossibleDays []Day `json:"possible_days"`
    PossibleEvents []*Events `json:"possible_events"`
    NumberOfDays int `json:"number_of_days"`
    Events []int `json:"events"`
}

func NewScheduler(events []int, postHours []int, numberOfDays int) {
    // All possible times for all possible days
    // TODO add already scheduled events as satisfied
    /*
        - Have a list of all possible post events
        - Keep track of a map from day to post event
        - On IsConsistent check if event
    */
    var possibleDays []Day
    var possibleEvents []*PostEvent

    now := time.Now()
    for dayInt := range numberOfDays {
        day := &Day{}
        for hour := range postHours {
            possibleEvent := &PostEvent{PostAt: time.Date(now.Year(), hour, day)}
            append(day.PostEvents, possibleEvent)
            append(possibleEvents, possibleEvent)
        }
        append(possibleDays, day)
    }
    return &Scheduler{
        Events:events,
        NumberOfDays: numberOfDays,
        PossibleDays: possibleDays,
        PossibleEvents: possibleEvents,
    }
}

func (scheduler *Scheduler) IsComplete(assignment []Days) bool {
    // all events have been assigned at least once
    // IsConsistent
    for day := range assignment {
        for postEvent := range day.PostEvents {
            if (postEvent.PostID == 0) {
                return false
            }
        }
    }
    // 
    return true
}

func isInDay(events []int, event int) bool {
    for evt := range events {
        if event == evt {
            return true
        }
    }
    return false
}

func (scheduler *Scheduler) IsConsistent(postEvent *PostEvent, assignment []Days) bool {
    // check if constrainsts are satisfied
    // no same event in the same day

    var dayEvents []int
    for day := range assignment {
        for assignedPostEvent := range day.PostEvents {
            if (assignedPostEvent.PostID != 0) {
                append(dayEvents, assignedPostEvent.PostID)
            }
        }
        if isInDay(postEvent.PostID) {
            return false
        }
    }
    // no  
    return true
}

func Solve() ([]Days, bool) {
    var assignment []Days
    return BacktrackSearch(assignment)
}

func isUnassigned(assignment []Days, event int) bool {
    for day := assignment {
        for postEvent := range day.PostEvents {
            if (postEvent.PostID == event) {
                return true
            }
        }
    }
    return false
}

func SelectUnassigned(days []Days, assignment []Days, scheduler *Scheduler) int {
    // for each event in assignment
    // if there is no post event
    // return?
    for event := scheduler.Events {
        unassigned := isUnassigned(assignment, event)
        if (unassigned == true) {
            return event
        }
    }
}

func isAssignedEvent(assignment []days, postEvent *PostEvent) bool {
    for assignedDay := range assignment {
        for assignedPostEvent := range assignedDay.PostEvents {
            if assignedPostEvent.PostAt == postEvent.PostAt {
                return true
            }
        }
    }
    return false
}

func OrderDomainEvents(event int, assignment []Days, scheduler *Scheduler) []*PostEvent {
    var postEvents []*PostEvent
    for day := scheduler.Days {
        for postEvent := range day.PostEvents {
            if(postEvent.PostID == 0 && !isAssignedEvent(assignment, postEvent)) {
                append(postEvents, &postEvent)
            }
        }
    }
    return postEvents
}

func BacktrackSearch(assignment []Days) ([]Days, bool) {
    // if events are assigned across all dates consistently
    // may be more than once
    if scheduler.IsComplete(assignment) {
        return assignment, false
    }

    // get unassigned event
    unassignedEvent := SelectUnassigned(scheduler.PossibleDays, assignment, scheduler)
    // for possible times on possible days
    for postEvent := OrderDomainEvents(unassignedEvent, assignment, scheduler) {
        // if the the time is consistent
        if scheduler.IsConsistent(postEvent, assignment) {
            // then assign the event to the time
            &postEvent.PostID = unassignedEvent
            result, failure := BacktrackSearch(assignment, scheduler)
            if failure == false {
                return result, false
            }
            &postEvent.PostID = 0
        }
    }
    return assignment, true 
}