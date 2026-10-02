---
# 1. Copy this file into the _projects/ folder and rename it, e.g. _projects/my-new-project.md
#    The file name becomes the web address: /projects/my-new-project/
# 2. Fill in the fields below. Lines starting with # are notes and can be deleted.

title: Full project title
short: Short name                 # label shown on the map (2–3 words)
date: 2026-09-01                  # used only for sorting, newest first
period: Sep – Dec 2026            # shown to visitors
context: Course project, UC Berkeley   # or your role, e.g. "Graduate Researcher, ..."
category: earth                   # pick ONE: earth / sensing / mobility / infrastructure (see _data/categories.yml)
tags: [Python, GIS]               # skills for filtering; reuse existing ones when you can:
                                  # Python, R, JavaScript, GIS, Remote sensing, SAR, LiDAR, 3D,
                                  # Simulation, Optimization, Signal processing, Mobility data
location:
  name: Berkeley, CA
  lat: 37.8719                    # right-click a spot in Google Maps to copy its coordinates
  lon: -122.2585
summary: One sentence that appears in the project list and under the title.

# --- Everything below is optional. Delete what you don't need. ---
team: With Name One and Name Two.
results:
  - label: Key number
    value: −12% cost
  - label: Another result
    value: 3× faster

# A video (put the file in assets/projects/<project-name>/)
video:
  src: /assets/projects/my-new-project/demo.mp4
  poster: /assets/projects/my-new-project/poster.jpg
  caption: What the video shows.

# Before/after image slider
compare:
  before_label: Before
  after_label: After
  default: 0                      # which set is shown first (0 = first)
  sets:
    - label: 2024
      before: /assets/projects/my-new-project/2024-a.jpg
      after: /assets/projects/my-new-project/2024-b.jpg
      note: Text shown under the images for this set.
---

Write the project here in normal Markdown. A short paragraph on the question you tackled, then a few bullets:

- What you did, with which tools.
- What you found.

You can also add images anywhere in the text:

![Description of the image]({{ '/assets/projects/my-new-project/figure.jpg' | relative_url }})
