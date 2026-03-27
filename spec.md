# Member App Overview

**Soul Seated Journey** is an app for Members participating in Soul Seated's guided in-person and online program to help BIPOC emerging adults discover purpose, meaning, and connection.

Each program will be eight weeks and have a cohort of 48 members. At the start of the Program, the members are split into smaller groups called Pods. Each Pod will have six members, plus a Peer Ambassador, who will act as a facilitator for the Pod during in-person activities and for discussions amongst Pod members in the app, via the text chat feature.

Outside of the in-person sessions, Members will use the app to

keep in touch, meet 1:1 with their Guide, access content that supports their work in the program, and track their progress.

## Definitions

- **Cohort** - the 48 Members participating in the Journey
- **Guide** - a Journey Team member who meets with Members 1:1 to amplify Program learnings and ensure members have the stability and ground to digest them.
- **Journey Team** - a blanket term describing the people delivering the Program
- **Member** - emerging adults participating in the Journey
- **On-Call Support** - the designated Guide, Peer Ambassador, or Support Agent who is currently rostered to receive and respond to async support messages from any Member. Each cohort has one on-call slot at a time; the roster is managed by Journey Team admins.
- **Peer Ambassadors** - members of the Journey Team who lead the Pods. One Peer Ambassador is assigned to each Pod.
- **Pod** - groups of six Members, plus one Peer Ambassador
- **Program** - the eight-week structured journey. A Program has a start date, end date, and is linked to exactly one Cohort.
- **Session** - a scheduled event within the Program (e.g., a live group session, a 1:1 video call). Sessions have a type, start time, duration, and facilitator.

# User Stories & Requirements

## Account and Profile

### Account creation

- As a Member, I want to create an account and authenticate (sign in) so that I can securely access my personal journey. Priority: High
  - Authentication method: email address + password, with optional passkey (WebAuthn) as an alternative credential.
  - Required fields at sign-up: email address, password (min 8 characters, 1 uppercase, 1 number), display name.
  - On first sign-in, the Member is prompted to complete their full profile and accept the Terms of Service.
- As a Member, I want to securely sign out of my account in order to prevent others from accessing my personal journey. Priority: High
- As a Member, I want to accept the platform terms of service and data privacy agreement during account setup so that I understand how the app will use my data and how my privacy will be protected. Priority: High
- As a Member, I want to reset my password or passkey from the sign-in screen so that I can regain access to my account quickly if I am locked out. Priority: Medium
  - Reset flow: Member enters email → receives a time-limited (30 min) reset link → sets new credential.
- **Session management**: Access tokens expire after 24 hours. A silent refresh token (valid 30 days) is used to re-issue access tokens without requiring re-login. On sign-out, both tokens are invalidated server-side.

### Profile Editing

- As a Member, I want to edit my profile (including display name and picture) so that I'm represented to the community in the way I want. Priority: High
- As a Member, I can add a hero image to my profile in order to further customize how I present myself to the community. Priority: High

| Field Name         | Type          | Required | Description/Purpose                                                                    |
| ------------------ | ------------- | -------- | -------------------------------------------------------------------------------------- |
| Email              | Text (email)  | Yes      | Used for authentication and notifications. Not publicly visible to other Members.      |
| Display Name       | Text          | Yes      | The name the Member wishes to be called by peers and Guides.                           |
| "My Journey" Bio   | Long Text     | Yes      | A short introduction about why they joined the program and what they hope to discover. |
| Profile Photo      | Image         | Yes      | A clear representation of the Member.                                                  |
| Hero Image         | Image         | No       | A banner image (e.g., nature, art) that reflects the Member's personality.             |
| Pronouns           | Dropdown/Text | No       | An optional field to foster an inclusive and respectful environment.                   |
| Current Vibe       | Emoji/Status  | No       | A short status to communicate current energy to the Pod. Expires automatically after 24 hours. Allowed values: a single emoji from a curated set of ~20 options, plus an optional short text label (max 30 characters). |
| Hometown/Roots     | Text          | No       | To help build connections and find shared backgrounds within the BIPOC community.      |

### Preference management

- As a Member, I want to view and edit my preferences so that I can customize my experience with the Member App. Priority: Medium
  - **Communication & Availability**:
- **1:1 Availability:** A dedicated interface to set recurring or one-off time slots for video calls with their Guide.
  - Availability Slot fields: `day_of_week` (0–6), `start_time` (HH:MM), `end_time` (HH:MM), `is_recurring` (boolean), `specific_date` (nullable date, required when `is_recurring` is false), `timezone` (IANA timezone string, inherited from profile setting).
- **Timezone Setting:** Crucial for remote freelancers like Sara who may move frequently. Stored as an IANA timezone string (e.g., `America/New_York`). All scheduled event display times and notification delivery times are adjusted based on this setting.
  - **Notification Controls**:
- **Notification Frequency:** Options for "Instant," "Daily Digest," or "Important Only" to keep inboxes manageable.
- **Notification types**:
  - Push notification
  - Email
  - In-app notification
- **Quiet Hours:** A "Do Not Disturb" mode that silences all app notifications during specific hours to support mental hygiene. Priority: Low

## Content Library

### Content Item Data Model

All content in the library is represented by a Content Item with the following fields:

| Field Name    | Type                                      | Required | Description                                                     |
| ------------- | ----------------------------------------- | -------- | --------------------------------------------------------------- |
| id            | UUID                                      | Yes      | Unique identifier.                                              |
| title         | Text                                      | Yes      | Display title of the content.                                   |
| type          | Enum: `text`, `image`, `audio`, `video`   | Yes      | Determines which media player/renderer to use.                  |
| week_number   | Integer (1–8)                             | Yes      | The program week this content is associated with.               |
| description   | Long Text                                 | No       | A brief summary shown in list/search views.                     |
| url           | Text (URL)                                | Yes      | CDN URL to the media asset or a rich-text body for type `text`. |
| duration_sec  | Integer                                   | No       | Duration in seconds; applicable to `audio` and `video` types.  |
| thumbnail_url | Text (URL)                                | No       | Preview image for `video` and `audio` content.                  |
| author        | Text                                      | No       | Creator or curator attribution.                                 |
| tags          | Array of Text                             | No       | Free-form tags for search/filtering.                            |
| created_at    | Timestamp                                 | Yes      | When the item was added to the library.                         |

Content is uploaded and managed by Journey Team admins via a separate admin interface (out of scope for Member App).

### Content organized by program week

- As a Member, I want to view library content organized by the program weeks so that I can easily find materials relevant to my current week of the Program. Priority: High

### Multimedia consumption (text, images, audio, video) Priority: Medium

- As a Member, I want to read text/images from the content library so that I can engage with learning materials relevant to my personal journey.
- As a Member, I want to listen to audio content from the content library so that I can engage with learning materials relevant to my personal journey.
- As a Member, I want to watch videos from the content library so that I can engage with learning materials relevant to my personal journey.

### Bookmarking (with scheduling options) Priority: Low

- As a Member, I want to bookmark library content so that I can easily come back to it later
- As a Member, I want to view a list of all my bookmarked items so that I can easily return to my favorite resources

### Read/unread status tracking

- As a Member, I want to mark library content as seen or unseen so that I can keep track of what I have already reviewed. Priority: Medium

### Search

- As a Member, I want to filter and search the content library by keyword, type, week, or status (read/unread) so that I can quickly find items I am in the mood for. Priority: High
  - Searchable fields: `title`, `description`, `tags`.
  - Filter dimensions: `type` (text / image / audio / video), `week_number` (1–8), `status` (read / unread / bookmarked).

## Guide Interactions

### Dedicated guide home screen Priority: High

- As a Member, I want to view a "home" screen dedicated to guide communication and check-ins so that I can easily access my guide's support.

### 1:1 video calls Priority: High

- As a Member, I want to view my guide's profile so that I can learn more about them.
  - As a Member, I want to see my guide's experience and areas of focus so that I understand how they can best support me.
- As a Member, I want to see my guide's availability status on the home screen so that I know when they are reachable before I reach out.

- As a Member, I want to schedule 1:1 video call sessions with my guide so that we have dedicated time to connect.
  - Scheduling is based on the Guide's published Availability Slots (see Preference management). The Member picks a slot; the system creates a Session record and sends calendar invites to both parties.
- As a Member, I want to view upcoming scheduled video call dates and times so that I can plan my schedule around them.
- As a Member, I want to join a video call with a guide so that I can participate in my scheduled 1:1 sessions.
  - Video calls are conducted via an embedded WebRTC integration (e.g., Daily.co or similar). A join URL is generated when a Session is created and is valid only for the scheduled time window (±15 min).

### Asynchronous text/voice messaging Priority: High

- As a Member, I want to communicate with the "on call" Guide/Peer Ambassador/Support Agent asynchronously using text chat or voice messages so that I can get support when needed.
  - Messages are routed to whichever Journey Team member is currently designated as On-Call Support (see Definitions). The on-call roster is visible to Members as a display name (e.g., "Maya is on call today").
- As a Member, I want to delete or edit the messages I have sent to my guide so that I can fix typos, add context, or remove things that make me uncomfortable.
  - Edit is allowed within 15 minutes of sending. Deletion is allowed at any time; deleted messages are replaced with a "[message removed]" placeholder visible to both parties.

### File uploads Priority: Low

- As a Member, I can upload files to my guide, in order to express myself and communicate with my guide using various mediums (pictures of my journal or sketches, for example).
  - Allowed types: JPEG, PNG, GIF, PDF, MP3, M4A, MP4. Maximum file size: 25 MB per file, 5 files per message.
- As a Member, I want to preview uploaded files before sending them so that I can confirm I'm sharing the right content.

### Status check-ins Priority: Medium

- As a Member, I want to submit check-ins with my guide so that they are updated on my situation and progress.
- As a Member, I want to be reminded of my progress so that I maintain the momentum to keep doing this consistently.

**Check-in data model (Guide check-in):**

| Field Name       | Type                                          | Required | Description                                           |
| ---------------- | --------------------------------------------- | -------- | ----------------------------------------------------- |
| id               | UUID                                          | Yes      | Unique identifier.                                    |
| member_id        | UUID (FK → Member)                            | Yes      | The Member submitting the check-in.                   |
| guide_id         | UUID (FK → Guide)                             | Yes      | The Guide receiving the check-in.                     |
| mood_score       | Integer (1–5)                                 | Yes      | Overall mood or energy level.                         |
| note             | Long Text                                     | No       | Free-text update for the guide.                       |
| submitted_at     | Timestamp                                     | Yes      | When the check-in was submitted.                      |
| program_week     | Integer (1–8)                                 | Yes      | Which program week this check-in belongs to.          |

## Guided Practice Priority: Medium

### View recommended guided practices Priority: Low

- As a Member, I want to follow guided practice activities so that I have structured support for my inner work.
- As a Member, I want to view a list of recommended guided practice activities for my current program phase so that I know what inner work is suitable for me.
- As a Member, I want to mark a guided practice as complete so that I can track which practices I have engaged with.

### Create/edit journal entries Priority: Medium

- As a Member, I want to **create** and **edit** journal entries so that I can document my personal insights.
  - A journal entry is a free-form personal log of events or experiences. There are no required prompts; the placeholder text "What happened?" is shown in the empty body field to inspire writing.
  - Members can attach media (photos, audio recordings) to any entry.
  - Entries are private by default and are never shared with the Guide or Pod unless the Member explicitly shares a specific entry.
- As a Member, I want to delete a journal entry so that I can maintain ownership and privacy over my personal writing.

### Create/edit reflections Priority: Medium

- As a Member, I want to create and edit reflections so that I can document my personal insights.
  - A reflection is a structured response to a program-provided prompt (e.g., "What did I learn this week?"). Each reflection is linked to exactly one prompt from the content library. The prompt is read-only; the Member writes their response in the Content Body field.
  - Reflections are private by default. The Member may choose to share an individual reflection with their Guide.
- As a Member, I want to delete a reflection entry so that I can maintain ownership and privacy over my personal writing.

### Create/edit intentions Priority: Medium

- As a Member, I want to create and edit intentions so that I can document my personal insights.
  - An intention is a forward-looking commitment statement ("I will…"). Each intention includes a Success Indicator field where the Member describes what "done" looks like, enabling self-assessment at the end of the week.
  - Intentions are private by default.
- As a Member, I want to delete an intention entry so that I can maintain ownership and privacy over my personal writing.

| **Data Fields**   | **Journal**        | **Reflection**        | **Intention** |
| ----------------- | ------------------ | --------------------- | ------------- |
| Placeholder       | _"What happened?"_ | _"What did I learn?"_ | _"I will…"_   |
| Date (mm/dd/yyyy) | ✓                  | ✓                     | ✓             |
| Content Body      | ✓                  | ✓                     | ✓             |
| Media Attachment  | ✓                  | ✓                     | ✓             |
| Prompt            |                    | ✓                     |               |
| Success Indicator |                    |                       | ✓             |

### Response prompts for feedback and mood Priority: Low

- As a Member, I want to view and respond to prompts (such as feedback, mood, and other measurement instruments) so that my growth and well-being can be tracked.

### Create/edit to-do and to-don't lists Priority: Low

- As a Member, I want to create and edit a to-do/don't list so that I can actively manage my behavioral goals.
- As a Member, I want to mark items on my to-do list as complete so that I can track my progress toward my behavioral goals.

## Action Planning & Scheduler

### Schedule Event

- As a Member, I want to view all my scheduled events (1:1 calls, pod sessions, live sessions) in a single calendar view so that I can plan my time holistically. Priority: High
- As a Member, I want to view a "schedule" screen for scheduled events so that I can plan my time accordingly. Priority: Medium
  - As a Member, I want to see which events I have already attended and which are still upcoming so that I can track my participation. Priority: Low
- As a Member, I want to view details for a specific scheduled event (date, time, format, facilitator) so that I can be prepared logistically. Priority: Medium
- As a Member, I want to add a scheduled program event to my personal calendar (e.g., Google Calendar, Apple Calendar) so that it integrates with my existing schedule. Priority: Low
  - Implementation: generate a standard `.ics` (iCalendar) file for download, and provide deep-link URLs for Google Calendar and Apple Calendar. No OAuth scope required for this approach.

## Pod & Community

### Pod home screen Priority: High

- As a Member, I want to view a "home" screen for my pod so that I can easily access my peer group.
- As a Member, I want to see a list of the members in my pod so that I know who I'm on this journey with.
- **Pod assignment**: Members are assigned to Pods by a Journey Team admin before the Program begins, via the admin interface (out of scope for Member App). The assignment is fixed for the duration of the Program.

| Field Name            | Type   | Required | Description/Purpose                                                                |
| --------------------- | ------ | -------- | ---------------------------------------------------------------------------------- |
| Display Name          | Text   | Yes      | The name of the Pod (e.g., "Pod Sunrise").                                         |
| Profile Photo         | Image  | Yes      | A clear representation of the Pod.                                                 |
| Hero Image            | Image  | Yes      | A banner image representing the Members of the Pod. Set by the Peer Ambassador.    |
| Members               | Array  | Yes      | Each Member's profile photo with mood emoji (Current Vibe).                        |
| The Peer Ambassador   | Object | Yes      | The Peer Ambassador's profile photo, mood emoji, and a QuickMessage button. There is exactly one Peer Ambassador per Pod. |
| Upcoming Pod Session  | Object | No       | Show an upcoming pod session's title, start time, and **`Join Now`** shortcut. Null if no session is scheduled in the next 7 days. |

**QuickMessage**: Tapping the QuickMessage button on the Peer Ambassador opens a pre-populated direct message draft addressed to that Peer Ambassador in the async pod chat, allowing the Member to send a message without navigating away from the Pod home screen.

### Asynchronous pod communication (text, voice, direct messages with Peer Ambassadors) Priority: Medium

- As a Member, I want to communicate with my pod asynchronously using text chat or voice messages so that we can support each other between sessions.
- As a Member, I want to react to a message in the pod channel with an emoji so that I can prove my existence without interrupting the conversation (or without spending too much effort).

### Pod check-ins Priority: Medium

- As a Member, I want to submit check-ins with my pod so that we can maintain shared accountability and connection.

**Check-in data model (Pod check-in):**

| Field Name       | Type                                          | Required | Description                                             |
| ---------------- | --------------------------------------------- | -------- | ------------------------------------------------------- |
| id               | UUID                                          | Yes      | Unique identifier.                                      |
| member_id        | UUID (FK → Member)                            | Yes      | The Member submitting the check-in.                     |
| pod_id           | UUID (FK → Pod)                               | Yes      | The Pod receiving the check-in.                         |
| mood_score       | Integer (1–5)                                 | Yes      | Overall mood or energy level at time of check-in.       |
| note             | Long Text                                     | No       | A brief message visible to all Pod members.             |
| submitted_at     | Timestamp                                     | Yes      | When the check-in was submitted.                        |
| program_week     | Integer (1–8)                                 | Yes      | Which program week this check-in belongs to.            |

### Cohort-wide message boards Priority: Low

- As a member, I want to post to a cohort-wide message board to share about my experience beyond my smaller pod group.
  - Moderation: Peer Ambassadors and Guides can hide or delete any post on the cohort board. Members can only delete their own posts.

## Program and Schedule

### Program overview screen Priority: High

- As a Member, I want to view an "overview" screen for the entire program so that I understand the full arc of the transformation journey.
- As a Member, I want to see upcoming phases and milestones so that I can mentally and practically prepare for what's ahead.
- As a Member, I want to view scheduled daily practices on the home screen, so I can plan my day accordingly.

### Weekly focuses screen Priority: Medium

- As a Member, I want to view a "home" screen for each week of the program so that I know what to focus on currently.
- As a member, I want to browse and schedule specific practices/exercises for specific days.

## Progress Tracking

### Progress log Priority: Medium

- As a Member, I want to view a progress log that aggregates my completed activities, check-ins, and reflections so that I can see all the work I've contributed to my journey.
- As a Member, I want to view a progress log that illustrates my advancement during the Journey, so I can maintain momentum and continue my journey consistently.

**Progress calculation:** A Member's progress is calculated as a percentage of completed activities out of the total expected activities for all elapsed weeks. The following actions each count as one completed activity:

| Activity Type           | Completion Trigger                                      |
| ----------------------- | ------------------------------------------------------- |
| Content Item            | Marked as read / watched / listened to completion       |
| Guided Practice         | Marked as complete by the Member                        |
| Guide Check-in          | Check-in submitted                                      |
| Pod Check-in            | Check-in submitted                                      |
| Journal Entry           | Entry saved (any length)                                |
| Reflection              | Entry saved with a non-empty Content Body               |
| Intention               | Entry saved with a non-empty Content Body               |
| To-do item              | Marked as complete                                      |
| 1:1 Video Call attended | Session status set to "completed" (≥ 5 min duration)   |

The progress percentage shown on the progress log = `completed_activities / total_expected_activities_to_date × 100`.

## Notifications

### In-app announcements Priority: Medium

- As a Member, I want to view and dismiss in-app announcements so that I stay informed about important updates.
- As a Member, I want to turn off notifications as I wish so that I won't be bothered when I need to be focused.

**Notification data model:**

| Field Name        | Type                                                        | Required | Description                                                            |
| ----------------- | ----------------------------------------------------------- | -------- | ---------------------------------------------------------------------- |
| id                | UUID                                                        | Yes      | Unique identifier.                                                     |
| member_id         | UUID (FK → Member)                                          | Yes      | Recipient.                                                             |
| type              | Enum: `announcement`, `message`, `checkin_prompt`, `session_reminder`, `system` | Yes | Determines display style and deep-link behavior. |
| title             | Text                                                        | Yes      | Short headline (max 80 characters).                                    |
| body              | Text                                                        | No       | Optional longer description (max 255 characters).                      |
| deep_link         | Text (URL path)                                             | No       | In-app route to navigate to on tap (e.g., `/guide/messages`).          |
| is_read           | Boolean                                                     | Yes      | Whether the Member has viewed it. Default: false.                      |
| created_at        | Timestamp                                                   | Yes      | When the notification was generated.                                   |

### Email reminders Priority: Low

- As a Member, I want to receive email reminders for sessions and key events so that I never miss an important part of the program.
- As a Member, I want to control which types of email reminders I receive so that my inbox is not overwhelmed with notifications I don't find useful.

### Push notifications Priority: High

- As a Member, I want to receive push notifications for time-sensitive events (e.g., upcoming 1:1s, new messages from my guide, new check-in prompts) so that I won't miss the events even when I'm not actively using the app.
  - Push tokens (APNs / FCM) are registered on first app launch post-login and refreshed automatically. A Member may have up to 3 registered devices simultaneously.

## Support Priority: Medium

- As a Member, I want to request support for logistics, tech, or other issues so that I can resolve problems quickly and continue my journey without friction. (Note: Service opportunity registration is not in scope for the Alpha launch).
- As a Member, I want to receive confirmation that my support request has been received (or view the status of my open support requests) so that I know help is on the way.

**Support ticket data model:**

| Field Name    | Type                                                          | Required | Description                                                    |
| ------------- | ------------------------------------------------------------- | -------- | -------------------------------------------------------------- |
| id            | UUID                                                          | Yes      | Unique identifier.                                             |
| member_id     | UUID (FK → Member)                                            | Yes      | The Member who submitted the request.                          |
| category      | Enum: `logistics`, `tech`, `emotional_support`, `other`       | Yes      | Helps route the ticket to the right team.                      |
| description   | Long Text                                                     | Yes      | Description of the issue.                                      |
| status        | Enum: `open`, `in_progress`, `resolved`, `closed`             | Yes      | Current state of the ticket. Default: `open`.                  |
| created_at    | Timestamp                                                     | Yes      | When the ticket was submitted.                                 |
| resolved_at   | Timestamp                                                     | No       | When the ticket was resolved. Null until resolved.             |
