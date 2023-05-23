#!/bin/bash

# Update system
sudo apt update
sudo apt upgrade -y

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Yarn
npm install --global yarn

# Install Next.js, Tailwind CSS, and Headless UI
yarn create next-app project-name
cd project-name
yarn add tailwindcss@latest postcss@latest autoprefixer@latest
yarn add @headlessui/react

# Initialize Tailwind CSS
npx tailwindcss init -p

# Create necessary directories and files
mkdir -p src/components src/pages src/utils
touch src/components/ProjectList.tsx src/components/ModuleList.tsx src/components/ModuleDetails.tsx src/pages/index.tsx src/utils/api.ts
