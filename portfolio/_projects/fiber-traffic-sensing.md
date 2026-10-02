---
title: Hearing traffic through fiber-optic cable
short: Fiber traffic sensing
date: 2026-03-01
period: Mar 2026 – present
context: Graduate Researcher, Soga Research Group
category: sensing
tags: [Python, Signal processing]
location:
  name: UC Berkeley, CA
  lat: 37.8735
  lon: -122.2595
summary: Telling cars, motorbikes, bicycles and pedestrians apart from the strain they leave in a fiber under the road.
featured: true
demo: das
---

A fiber-optic cable under the road stretches a tiny amount every time something passes over it. Distributed acoustic sensing (DAS) records that strain along the whole length of the cable, which turns ordinary telecom fiber into a long line of traffic sensors. The open question I work on is whether you can tell *who* passed.

- Compared time-series and spatial-series features (amplitude, peak count, frequency content and spatial extent) across vehicles, motorbikes, bicycles and pedestrians, to establish a feature basis for road-user classification.
- Built a Python processing and visualization pipeline for low-SNR signals such as pedestrians, producing strain-vs-time and strain-vs-location profiles to test whether weak gait-frequency signals are detectable.
