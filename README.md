# Vector — Pipeline Builder

A drag-and-drop pipeline builder built with React and FastAPI. Create node-based workflows by connecting inputs, LLMs, text templates, filters, and more on an interactive canvas.

![Build tab](https://img.shields.io/badge/stack-React%20%2B%20FastAPI-blue)

## What's inside

- **Frontend** — React + ReactFlow canvas with 9 node types, undo/redo, drag-and-drop (tap on mobile), and a demo pipeline loader
- **Backend** — FastAPI server that parses pipelines and checks if they form a valid DAG

## Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [pnpm](https://pnpm.io/) (`npm i -g pnpm`)
- [Python 3.8+](https://www.python.org/)

## Getting started

```bash
# clone the repo
git clone https://github.com/ishan-crd/vectorshift-assignment.git
cd vectorshift-assignment

# install frontend + root dependencies
pnpm install
cd frontend && pnpm install && cd ..

# install backend dependencies
pip install fastapi uvicorn

# run both servers
pnpm dev
```

This starts:
- Frontend on [http://localhost:3000](http://localhost:3000)
- Backend on [http://localhost:8000](http://localhost:8000)

If you want to run them separately:

```bash
pnpm dev:frontend   # just the React app
pnpm dev:backend    # just the FastAPI server
```

## Node types

| Node | What it does |
|------|-------------|
| **Input** | Entry point — accepts text, file, or image |
| **Output** | Exit point — outputs text, markdown, image, or file |
| **LLM** | Calls a language model with system + prompt inputs |
| **Text** | Template with `{{variable}}` support — creates dynamic input handles |
| **Note** | Sticky note for annotations (no connections) |
| **API** | Makes HTTP requests (GET/POST/PUT/DELETE) |
| **Timer** | Triggers on an interval |
| **Merge** | Combines two inputs into one |
| **Filter** | Passes or rejects data based on a condition |

## Usage

1. **Drag** nodes from the toolbar onto the canvas (or tap on mobile)
2. **Connect** output handles (green) to input handles (purple)
3. **Edit** fields directly inside each node
4. Use `{{variableName}}` in Text nodes to create dynamic inputs
5. Hit **Submit** to send the pipeline to the backend for validation

## Project structure

```
.
├── frontend/          # React app (CRA)
│   └── src/
│       ├── nodes/     # Node components + BaseNode abstraction
│       ├── components/# Modals, context menu, custom select
│       ├── nodeConfig.js  # All node type definitions
│       ├── store.js       # Zustand state (nodes, edges, history)
│       └── index.css      # Full design system
├── backend/
│   └── main.py        # FastAPI server with DAG checker
└── package.json       # Root scripts (pnpm dev runs both)
```
