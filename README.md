# GRA Recruiting Platform

A comprehensive recruitment platform built with Next.js, TypeScript, and Tailwind CSS. This platform bridges the gap between skilled talent and employment opportunities in Rwanda through an integrated assessment platform with standardized testing.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Profile Management**: Complete personal information, avatar, and address management
- **Skills & Competence**: Track technical skills, soft skills, and language proficiencies
- **Work & Education**: Manage work experience and education history
- **Document Management**: Upload and manage resumes, work samples, and portfolio links
- **Assessment Engine**: Standardized skills testing with multiple-choice and essay questions
- **Job Matching System**: AI-based matching algorithms connecting candidates with opportunities
- **Responsive Design**: Full support for mobile, tablet, and desktop devices
- **Role-Based Views**: Different interfaces for applicants and administrators

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI components
- **State Management**: React hooks (Context API)
- **UI Components**: Custom UI components with Radix UI primitives
- **Icons**: Lucide React and custom SVG icons
- **Form Handling**: React Hook Form

## Getting Started

### Prerequisites

Before setting up the project, ensure you have the following installed:

- Node.js (v22+ LTS)
- npm (v8.0.0 or higher) or yarn (v1.22.0 or higher)
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/grow-rwanda/gra-recruiting.git
cd gra-recruiting

2. Install dependencies

```bash
npm install
# or
yarn install
```

## Running the Application

1. Start the development server

```bash
npm run dev
# or
yarn dev
```

2. Build for production

```bash 
npm run build
# or
yarn build
```

3. Start the production server

```bash
npm run start
# or
yarn start
```
The application will be available at http://localhost:3000

## Project Structure

```bash

/
├── public/               # Static assets
│   ├── brand/            # GRA brand assets
│   ├── images/           # Images used throughout the platform
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── (routes)/     # All application routes
│   │   │   ├── admin/    # Admin routes
│   │   │   ├── applicant/# Applicant routes
│   ├── components/       # React components
│   │   ├── admin/        # Admin-specific components
│   │   ├── applicant/    # Applicant-specific components
│   │   ├── assessment/   # Assessment and exam components
│   │   ├── common/       # Shared components
│   │   ├── icons/        # Custom SVG icons
│   │   ├── layout/       # Layout components
│   │   ├── ui/           # UI components (buttons, inputs, etc.)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and libraries
│   ├── services/         # API service functions
│   ├── styles/           # Global styles
│   ├── types/            # TypeScript type definitions
├── .env.local            # Environment variables (create this file)
├── next.config.js        # Next.js configuration
├── package.json          # Project dependencies
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

## Usage

### Applicant View

- Navigate to `/applicant` to access the applicant dashboard
- Complete your profile through different sections:
    - User Profile (personal info and address)
    - Skills & Competence
    - Work & Education
    - Documents & Portfolio
- Take assessments and track your application progress

### Admin View

- Navigate to `/admin/dashboard` to access the admin dashboard
- View all applicants and their application status
- Manage assessment questions
- Review applicant profiles and assessment results
- Move applicants through the recruitment pipeline

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

License