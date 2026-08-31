# Building Collaborative Claude Code: A Shared AI Coding Workspace

AI coding tools are usually designed for one person at one terminal. In real teams, software work is rarely that isolated. A product manager may shape the workflow, an engineer may build the first version, a designer may refine the interface, and an AI agent may add domain-specific intelligence.

Collaborative Claude Code explores a simple idea: what if a Claude Code session could become a shared workspace?

<video controls src="0807Demo_Withaudio_h264.mp4" style="width: 100%; max-width: 960px;"></video>

## The Problem

Claude Code is powerful for individual development, but collaboration around it is awkward. If one person drives the terminal, teammates usually have to watch through screen sharing, wait for updates, or ask the driver to copy context manually.

That creates three problems:

- Only one person can operate the coding agent.
- Other teammates cannot easily follow the full terminal history.
- Passing work from one person to another loses context.

Collaborative Claude Code was built to make this workflow more natural.

## What We Built

Collaborative Claude Code is a browser-based shared terminal for Claude Code. Multiple users can join the same session, watch the same terminal output, and take turns controlling the workspace.

The core collaboration model has three roles:

- **Master**: the person who creates the session and manages control.
- **Viewer**: a guest who can watch the session in real time.
- **Controller**: the person who currently has permission to type into the terminal.

Only one user controls the terminal at a time. Guests can request control, and the master can approve the request or transfer control manually.

## How It Works

Each Collaborative Claude Code workspace runs inside a VM. A browser client connects to a backend terminal bridge, which attaches users to a persistent session runtime inside the VM. The runtime keeps the terminal alive across browser reconnects, while the bridge controls which client can send input.

The product flow is:

1. Create a Claude Code VM.
2. Open Collaborative Claude from the VM dashboard.
3. Create and connect to a session as the master.
4. Generate a guest link.
5. Let another user join as a viewer.
6. Transfer control when the next teammate is ready to work.

We also added a website preview panel, so if Claude Code starts a local dev server inside the VM, the generated website can be viewed directly from the collaborative page.

## Demo Scenario

In the demo, three teammates collaborate on a second-hand NVIDIA GPU marketplace.

The first teammate creates the basic seller workflow: sellers can upload used GPU listings with model name, condition, VRAM, price, and notes.

The second teammate takes control and turns the page into a buyer-facing marketplace, where customers can browse listings, compare GPU options, and understand which cards are good value.

The third teammate integrates an AI advisor widget. This assistant helps buyers ask questions such as whether a used RTX 3090 is still a good option for local AI inference, or whether an RTX 4080 SUPER requires a power supply upgrade.

This turns the demo from a simple webpage into a collaborative product-building workflow: structure first, experience second, intelligence third.

## Engineering Challenges

The most interesting part was not just showing the same terminal to multiple people. It was making the shared terminal behave correctly when different users had different roles, browsers, and screen sizes.

Several details mattered:

- Viewers should be able to watch terminal output without accidentally taking control.
- Control transfer should feel smooth and should not require manual reconnects.
- Terminal sizing should follow the active controller, so a small viewer window does not break the controller's output.
- Internal session details needed to stay invisible so the browser terminal felt like a normal Claude Code session.
- Mouse and keyboard behavior needed to work naturally in a browser, including terminal scrolling and website preview.

These details made the difference between a screen-sharing prototype and a usable collaborative coding environment.

## Why It Matters

Collaborative Claude Code is useful because modern AI development is increasingly cross-functional. People with different strengths need to work on the same artifact without losing context.

Instead of sending screenshots, copying logs, or asking one person to drive the whole session, teammates can join the same workspace and hand off control at the moment their expertise is needed.

For product demos, this also makes the AI coding process easier to explain. Viewers can see how a project evolves across stages, from a basic implementation to a polished interface to an AI-powered product experience.

## What's Next

The next direction is Agent-as-a-Service. Instead of requiring a user to manually operate Claude Code in the terminal, the system could accept a task, files, and configuration, then run Claude Code as a background job.

That would make Collaborative Claude Code more than a shared terminal. It could become infrastructure for repeatable AI engineering workflows, where teams submit jobs, monitor progress, and retrieve generated outputs.

Collaborative Claude Code started as a way to make Claude Code multiplayer. The broader goal is to make AI-assisted software development easier to share, review, and hand off across a team.
