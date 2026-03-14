# DP Calculator

A Material Design 3 web application for calculating **density-independent pixels (dp)** per Android Material Design guidelines. Built with Angular 21 and powered by modern reactive patterns using signals.

## Overview

The DP Calculator helps designers and developers convert between pixels (px) and density-independent pixels (dp) based on device specifications. It calculates pixel density (PPI) from device dimensions and provides bidirectional conversion between px and dp using the formula:

- **PPI** = √(width² + height²) / diagonal_inches
- **DP** = PX × (160 / PPI)
- **PX** = DP × (PPI / 160)

## Tech Stack

- **Framework**: Angular 21.2
- **UI Library**: Angular Material 21.2.2 (Material Design 3, Azure palette)
- **Build Tool**: Vite (`@angular/build:application`)
- **Package Manager**: pnpm
- **Testing**: Vitest
- **State Management**: Angular Signals + Reactive Forms
- **Deployment**: GitHub Pages via `angular-cli-ghpages`

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+

### Installation

```bash
pnpm install
```

### Development Server

Start the local development server:

```bash
pnpm start
```

Navigate to `http://localhost:4200/` in your browser. The application automatically reloads when you modify source files.

## Usage

1. **Enter Device Specifications**: Input the device's screen width and height in pixels along with diagonal screen size in inches
2. **View Calculations**: The app automatically calculates PPI and density bucket classification
3. **Convert Units**: Use the converter tool to switch between px and dp:
   - Enter a value in px to see the dp equivalent
   - Enter a value in dp to see the px equivalent
4. **Toggle Theme**: Use the toolbar button to cycle between light, dark, and system themes (preference is saved)

## Building

Build the project for production:

```bash
pnpm build
```

Build artifacts are stored in the `dist/` directory with optimizations for performance.

## Testing

Run unit tests with Vitest:

```bash
pnpm test
```

## Architecture

- **app.ts**: Minimal OnPush shell component with inline router outlet
- **app.routes.ts**: Lazy-loads the DpCalculatorComponent
- **dp-calculator/**: Main feature component with responsive Material Design 3 UI
- **theme.service.ts**: Manages light/dark/system theme with localStorage persistence

All components use:
- Angular signals for reactive state management
- `ChangeDetectionStrategy.OnPush` for optimal performance
- Standalone components (no NgModules)
- Reactive Forms for input handling

## Deployment

The application is deployed to GitHub Pages with a relative base href (`./`). Deploy changes using:

```bash
pnpm run deploy
```

## Resources

- [Angular Documentation](https://angular.dev)
- [Angular Signals](https://angular.dev/guide/signals)
- [Material Design 3](https://m3.material.io/)
- [Android Display Metrics](https://developer.android.com/training/multiscreen/screendensities)
