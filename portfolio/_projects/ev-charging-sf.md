---
title: Modeling EV charging behavior in San Francisco
short: EV charging
date: 2025-09-10
period: Sep – Dec 2025
context: Course project, UC Berkeley
category: mobility
tags: [Simulation, Mobility data]
location:
  name: San Francisco, CA
  lat: 37.7749
  lon: -122.4194
summary: An event-driven simulation of 1,000 electric cars, calibrated against real mobility traces.
demo: ev
results:
  - label: Agents
    value: 1,000 EVs
  - label: Data
    value: Replica mobility data, OpenStreetMap
---

Where does charging infrastructure break down? I simulated EV drivers moving through San Francisco and checked that they moved like real people before trusting any answer.

- Built an event-driven EV charging simulation combining Replica mobility data, OpenStreetMap road networks and charging infrastructure.
- Preprocessed multi-source mobility datasets and calibrated simulated trajectories against real Replica traces using jump length, radius of gyration and waiting time, as groundwork for a reinforcement-learning charging policy.
