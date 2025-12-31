---
description: Read this file to understand how to fetch data iin the project.
---

# Data Fetching Instructions
This document provides guidelines on how to fetch data in this project. Follow these instructions to ensure consistency and efficiency in data retrieval.

## 1. Use Server Components for Data Fetching

In Next.js ALWAYS use Server Components for data fetching. NEVER use Client Components for data fetching.


## 2. Data Fetching Methods

ALWAYS use the helper functions in /data firectory to fetch data. NEVER fetch data directly in the component files.

ALL helper functions in /data directory should use drizzle-ormfor database interactions.
