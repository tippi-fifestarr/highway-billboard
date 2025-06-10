# Highway Billboard Styling Architecture

This document provides visual diagrams to help understand the styling issues and our proposed solutions.

## Current Styling Flow

```mermaid
flowchart TD
    A[globals.css] -->|@tailwind directives| B[Tailwind CSS v4]
    C[tailwind.config.js] -->|Configuration| B
    D[postcss.config.mjs] -->|Plugin config| B
    B -->|CSS Processing| E[Final CSS]
    F[Component Inline Styles] -->|Direct styling| G[Rendered UI]
    E -->|Applied classes| G
    H[prefers-color-scheme: dark] -->|Forces dark mode| G
    
    subgraph "Problem Areas"
        D
        H
    end
```

## Styling Issues Diagnosis

```mermaid
flowchart TD
    A[Dark Mode Override] -->|Forces dark background| B[Styling Issues]
    C[Tailwind v4 Changes] -->|PostCSS plugin moved| B
    D[CSS Processing Order] -->|Layer conflicts| B
    E[Component Styling] -->|Not applied correctly| B
    
    B -->|Results in| F[Dark UI]
    B -->|Results in| G[Missing Highway Graphics]
    B -->|Results in| H[Incorrect Component Styling]
```

## Proposed Solution Architecture

```mermaid
flowchart TD
    A[globals.css] -->|Remove dark mode media query| B[Tailwind CSS v4]
    C[tailwind.config.js] -->|Add safelist for highway classes| B
    D[postcss.config.mjs] -->|Use @tailwindcss/postcss| B
    E[highway-styles.css] -->|Fallback CSS| F[Rendered UI]
    B -->|CSS Processing| F
    G[Component Inline Styles] -->|Direct styling| F
    
    subgraph "Solution Components"
        A
        C
        D
        E
    end
```

## Implementation Strategy

```mermaid
gantt
    title Highway Styling Fix Implementation
    dateFormat  YYYY-MM-DD
    section CSS Fixes
    Fix globals.css dark mode           :a1, 2025-06-10, 1d
    Update tailwind.config.js           :a2, after a1, 1d
    Fix postcss.config.mjs              :a3, after a2, 1d
    Create fallback CSS                 :a4, after a3, 1d
    section Component Fixes
    Update layout.tsx                   :b1, 2025-06-10, 1d
    Create test component               :b2, after b1, 1d
    Test with inline styles             :b3, after b2, 1d
    section Testing
    Clear cache and rebuild             :c1, after a4, 1d
    Browser testing                     :c2, after c1, 1d
    Fix remaining issues                :c3, after c2, 2d
```

## Component Styling Hierarchy

```mermaid
classDiagram
    class RootLayout {
        +WalletProvider
        +Header
        +Main
        +Footer
    }
    
    class HomePage {
        +FeaturedBillboard
        +TestHighwayStyling
    }
    
    class DriveByPage {
        +DriveByMessages
    }
    
    class PostPage {
        +PostMessageForm
    }
    
    class HighwayComponents {
        +highway-road
        +highway-lane-divider
        +highway-sign
        +billboard
        +gas-gauge
    }
    
    RootLayout --> HomePage
    RootLayout --> DriveByPage
    RootLayout --> PostPage
    HomePage --> HighwayComponents
    DriveByPage --> HighwayComponents
    PostPage --> HighwayComponents
```

## CSS Processing Flow

```mermaid
flowchart LR
    A[Tailwind Base] --> B[Tailwind Components]
    B --> C[Custom Highway Components]
    C --> D[Tailwind Utilities]
    D --> E[Inline Styles]
    
    subgraph "Processing Order"
        A
        B
        C
        D
        E
    end
```

## Dark Mode vs Highway Theme

```mermaid
flowchart TD
    A[User Preference] -->|prefers-color-scheme: dark| B{Dark Mode Media Query}
    B -->|Yes| C[Dark Theme Applied]
    B -->|No| D[Light Theme Applied]
    
    E[Highway Theme] -->|Custom Components| F[Highway Styling]
    
    C -->|Conflicts with| F
    D -->|Works with| F
    
    G[Solution] -->|Remove media query| H[Class-based Dark Mode]
    H -->|No conflict with| F