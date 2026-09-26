# CTRL ROOM

**SOUND / VISION / CULTURE / COMMUNITY**

Cape Town / South Africa

The digital home of CTRL ROOM: a creative collective bringing together events, filmed DJ sets, music releases, and the people behind them. The website should feel like entering a running control system for underground culture, with an archive that grows into the history of the collective.

> Experimental visually. Simple functionally.

## Project status

This repository currently contains the project brief only. The website, CMS, content schemas, and deployment setup have not been implemented. There are no installation, development, or build commands yet.

This README is based on the **CTRL ROOM WEBSITE** creative and technical brief (`ctrl room site.md`). It describes the intended direction and requirements, rather than completed features.

## The ecosystem

| Section | Purpose |
| --- | --- |
| **CTRL ROOM INVITES** | Events, lineups, ticket links, and documentation. |
| **CTRL ROOM STUDIOS** | Filmed DJ sets, with room for future film and audiovisual work. |
| **CTRL RECORDS** | The label's releases, artists, tracks, artwork, and listening links. |
| **ARCHIVE** | A connected record of events, sessions, releases, and creative work. |
| **ABOUT** | The collective's identity, origins, and approach. |
| **CONTACT** | A clear way to connect with the collective. |

These six sections form the initial website scope. System-inspired labels for About, Contact, and session playback remain open, but their meaning must be immediately understandable.

## Creative direction

The interface should emerge from the CTRL ROOM concept: dark, underground, digital, creative, and mysterious, while remaining practical to use.

**Black is the environment. Electric pink is the signal.** Pink marks active states, selections, loading, important information, and change.

The visual language draws on terminal interfaces, timestamps, system messages, layered information, digital noise, distortion, and low-resolution textures. These elements should create a distinct CTRL ROOM identity rather than a generic cyberpunk aesthetic.

The homepage should suggest access to an already-running system. An illustrative opening sequence is:

```text
CTRL_ROOM.COLLECTIVE
INITIALISING...

SOUND   — ONLINE
VISION  — ONLINE
EVENTS  — ONLINE
STUDIOS — ONLINE
RECORDS — ONLINE

SYSTEM STATUS: ACTIVE

CTRL ROOM COLLECTIVE
CAPE TOWN / SOUTH AFRICA
SOUND / VISION / CULTURE / COMMUNITY

ENTER CTRL ROOM
```

The exact wording and animation are still to be designed. The priority is the feeling of entering the system without slowing access to the content.

Navigation should be clear and consistent, with a possible numbered structure:

```text
01 / INVITES
02 / STUDIOS
03 / RECORDS
04 / ARCHIVE
05 / ABOUT
06 / CONTACT
```

## Content and publishing

The website should behave like a growing content system. Editors should be able to add information through a straightforward CMS, and reusable templates should generate the corresponding pages without new design or development work for every entry.

The core editorial actions are:

- Add event.
- Add session.
- Add release.
- Add artist.
- Add archive entry.

### Initial content model

| Content type | Required information from the brief |
| --- | --- |
| **Event** | Identifier such as `EVENT 001`, date, venue, location, lineup, tickets, photos, video, and status. |
| **Studio session** | Identifier such as `SESSION 001`, artist, date, location, duration, video, and photos. |
| **Release** | Catalogue identifier such as `CTRL001`, artist, release title, artwork, tracklist, release date, credits, and streaming links. |
| **Artist** | A shared artist identity that can connect sessions, event appearances, and releases; detailed fields remain to be defined. |
| **Archive entry** | Documentation and media associated with the collective's work; detailed fields and categories remain to be defined. |

Content relationships are central to the archive. A visitor discovering an artist through a Studio session should eventually be able to explore that artist's event appearances and label releases. Artist records can support these relationships before dedicated public artist profile pages are introduced.

### Archive

The archive is intended to preserve context and history, beyond displaying a gallery. Events, sessions, releases, artists, photography, video, and documentation should be connected and discoverable over time.

The implementation should allow new archive categories and content types to be added without redesigning the entire website. How archive entries relate to the original event, session, or release records remains a content-model decision.

## Video

**YouTube hosts the filmed DJ sets. The CTRL ROOM website curates and presents them. The archive preserves their context.**

Studio pages should:

- Embed the corresponding YouTube video.
- Display the artist and session information, including date, location, and duration.
- Include supporting photography or artwork.
- Link directly to the CTRL ROOM YouTube platform.
- Remain available as part of a permanent session archive.

The website does not need to host the session video files itself.

## Interaction, mobile, and performance

Potential interactions include text scrambling, blinking cursors, scrolling information, image transitions, subtle distortion, loading sequences, and system notifications. Motion should be intentional, with pauses and stillness between moments of activity:

```text
GLITCH → SIGNAL → IMAGE → INFORMATION → STILLNESS
```

Mobile is a primary experience, especially for visitors arriving from Instagram. Layouts and navigation should be designed for small screens, with the same black-and-pink identity and clear access to content.

Performance requirements include:

- Optimised images and appropriately sized media.
- Lazy loading of media and video embeds where appropriate.
- Restrained animation costs, particularly on mobile devices.
- A hosting and caching strategy that keeps pages responsive.
- Fast access to content without lengthy effects-driven loading screens.

## Technical direction

The brief identifies **Next.js** for the frontend and **Sanity CMS** for content management as the intended starting direction. Neither has been configured in this repository.

| Area | Direction / decision still needed |
| --- | --- |
| Frontend | Next.js, with reusable page templates and room for custom visual interactions. |
| Content management | Sanity CMS, with a simple editorial workflow for the core content types. |
| Content relationships | Define links between artists, events, sessions, releases, and archive material. Validate whether the CMS meets the brief's relational data needs and whether a separate database is necessary. |
| Graphics | Evaluate whether a rendering library is needed for the chosen effects; no graphics library is selected. |
| Video | YouTube embeds and outbound links, with session metadata managed through the CMS. |
| Hosting and delivery | Select hosting, asset delivery, caching, and deployment arrangements during implementation. |

The foundation should support ongoing publishing and future expansion without overbuilding the first release. Routine content updates should be manageable by the CTRL ROOM team; new functionality and larger design changes may require further development.

## Future expansion

Beyond the initial six sections, the brief anticipates:

- Public artist profiles.
- Interviews and editorial.
- Expanded documentation and film.
- Collaborations and submissions.
- Press and newsletter features.
- Additional archive categories.

These are future possibilities, not requirements to implement in the first version.

## Next steps

1. Confirm the initial content schemas, relationships, and publishing workflow.
2. Define the desktop and mobile interface, including the opening sequence and motion behaviour.
3. Set up the frontend, CMS, and deployment workflow.
4. Build reusable templates for events, sessions, releases, and archive content.
5. Populate representative content and verify navigation, publishing, and mobile performance.

The guiding goal is a digital CTRL ROOM that people can enter, explore, and return to as the collective grows.
