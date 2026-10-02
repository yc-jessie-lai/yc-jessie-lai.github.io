---
title: Food delivery route optimization
short: Delivery routing
date: 2024-02-01
period: Feb 2024 – Jan 2025
context: Research project, NCKU
category: mobility
tags: [Python, Optimization]
location:
  name: Tainan, Taiwan
  lat: 22.9905
  lon: 120.2050
summary: Comparing Tabu Search and a genetic algorithm on a pickup-and-delivery problem with real coordinates.
demo: delivery
results:
  - label: Scenario
    value: 30 couriers, 60 orders
  - label: Tabu Search vs GA
    value: ≈ 36% shorter routes, ≈ 30% faster
---

Every order is a pickup that must happen before its drop-off, and couriers can only carry so much. I compared two metaheuristics on real coordinates and road-network distances.

- Formulated on-demand food delivery as a pickup-and-delivery problem with capacity and precedence constraints, using the geographic coordinates of restaurants, customers and couriers.
- Implemented Tabu Search and a genetic algorithm in Python and evaluated them on road-network distances across several delivery scales.
