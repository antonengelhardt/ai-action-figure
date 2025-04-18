# Action Figure Generator

[Live Demo](https://ai-action-figure.me/)

Generate your own custom action figure using AI! Upload a photo of yourself and customize your action figure's details to create a viral-style action figure image.

## Features

- Upload a full body photo
- Customize action figure details:
  - Figure name
  - Outfit description
  - Facial expression
  - Packaging color scheme
- Generate high-quality action figure images using DALL-E 3
- Download and share your generated images

## Tech Stack

- Next.js 15 with Tailwind CSS
- OpenAI API for image generation
- react-dropzone for file uploads

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- pnpm package manager
- OpenAI API key

### Setup

1. Clone the repository:

```bash
git clone https://github.com/antonengelhardt/ai-action-figure.git
cd ai-action-figure
```

1. Install dependencies:

```bash
pnpm install
```

1. Create a `.env.local` file in the root directory with your API key:

```bash
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here
```

1. Start the development server:

```bash
pnpm dev
```

1. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Deploying

This application can be deployed to Vercel with minimal configuration:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add your OpenAI API key as an environment variable
4. Deploy!

## License

MIT
