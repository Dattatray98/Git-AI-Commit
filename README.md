# Navix

AI-powered Git commit message generator for developers.

Navix analyzes your staged Git changes and generates meaningful commit messages using:

- Ollama (local AI models)
- OpenAI models

Built with:
- TypeScript
- Bun
- Commander.js
- Ollama
- OpenAI SDK

---

# Features

- Generate AI commit messages from staged Git changes
- Support for Ollama local models
- Support for OpenAI models
- Persistent configuration system
- Simple CLI workflow
- Lightweight and fast

---

# Installation

## Install Globally

```bash
npm install -g "@jdattatray.ls/navix"
```

---

# Setup

Navix uses a persistent configuration system.

Configuration file location:

## Windows

```text
C:\Users\YOUR_USERNAME\.navix\config.json
```

## Linux / macOS

```text
~/.navix/config.json
```

---

# Configure Ollama

First install Ollama:

https://ollama.com

Then pull a model:

```bash
ollama pull model_name
```

- **Note** : You can use any model available on ollama.

Now configure Navix:

```bash
navix config --provider ollama --model model_name
```

---

# Configure OpenAI

Set your API key.

## Windows

```powershell
setx OPENAI_API_KEY "your-api-key"
```

Restart terminal after setting environment variable.

## Linux / macOS

```bash
export OPENAI_API_KEY="your-api-key"
```

Now configure Navix:

```bash
navix config --provider openai --model gpt-4.1
```

---

# Usage

## Stage Changes

```bash
git add .
```

---

## Generate Commit Message

```bash
navix commit
```

Navix will:
- analyze staged changes
- generate commit message
- create Git commit automatically

---

# Commands

## Configure Provider

```bash
navix config --provider ollama --model model_name
```

```bash
navix config --provider openai --model model_name
```

---

## Check Current Config

```bash
navix check-config
```

---

## Show Raw Git Diff

```bash
navix diff
```

---

## Show Filtered Diff

```bash
navix filter-diff
```

---

# Example Workflow

```bash
git add .

navix commit
```

Example output:

```text
feat: add authentication middleware
```

---

# Architecture

```text
commands/
    CLI commands

config/
    persistent config system

models/
    AI provider abstraction layer

git_tools/
    git diff and commit utilities

utils/
    helper utilities
```

---

# Project Structure

```text
src/
│
├── commands/
├── config/
├── core/
├── git_tools/
├── models/
└── utils/
```
---

# Requirements

- Node.js >= 18
- Git
- Ollama (optional for local AI)
- OpenAI API key (optional for cloud AI)

---

# Author

Dattatray Jojewar