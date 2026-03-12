"""
AI Reuse Recommendation Module
================================
Uses Google Gemini 2.5 Flash to suggest creative DIY projects
for reusing waste materials. Reads GEMINI_API_KEY from .env.local
at the root of the Becho project.

Usage:
    python reuse_ai.py
"""

import os
import sys
import json
import re
import pathlib

# Ensure this script's directory is on sys.path so sibling modules
# like `prompts.py` are always importable, regardless of working directory.
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))

from dotenv import load_dotenv
from google import genai

from prompts import get_projects_prompt, get_tutorial_prompt

# ─────────────────────────────────────────────
# Load API key from .env.local (project root)
# ─────────────────────────────────────────────
# This file lives at: ai models/ai_reuse/reuse_ai.py
# The .env.local is two levels up at the Becho root.
_ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
_ENV_PATH = _ROOT / ".env.local"

if _ENV_PATH.exists():
    load_dotenv(dotenv_path=_ENV_PATH)
else:
    load_dotenv(dotenv_path=pathlib.Path(".env.local"))

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("\n❌  ERROR: GEMINI_API_KEY is missing!")
    print(f"   Add it to your .env.local file at: {_ENV_PATH}")
    print("   Format:  GEMINI_API_KEY=your_api_key_here\n")
    sys.exit(1)

MODEL_NAME = "gemini-2.5-flash"

# Create the Gemini client
client = genai.Client(api_key=GEMINI_API_KEY)


# ─────────────────────────────────────────────
# Helper: call Gemini and extract JSON safely
# ─────────────────────────────────────────────
def _call_gemini(prompt: str) -> str:
    """Send a prompt to Gemini 2.5 Flash and return the raw text response."""
    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt
    )
    return response.text.strip()


def _extract_json(text: str):
    """
    Strip any markdown code fences and parse JSON from the response.
    Returns the parsed Python object.
    """
    cleaned = re.sub(r"```(?:json)?\s*", "", text)
    cleaned = cleaned.replace("```", "").strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as e:
        raise ValueError(
            f"Gemini returned invalid JSON.\nRaw response:\n{text}\nError: {e}"
        )


# ─────────────────────────────────────────────
# Core API Functions
# ─────────────────────────────────────────────

def get_reuse_projects(material: str, quantity: int, user_interest: str = None) -> list:
    """
    Generate 3–5 reuse project ideas for the given waste material.

    Args:
        material      (str): Type of waste (e.g., "plastic bottle", "cardboard")
        quantity      (int): Number of items available
        user_interest (str): Optional idea/suggestion from the user (e.g., "a lamp", "storage box")

    Returns:
        list: A list of project dicts, each with:
              - title       (str)
              - description (str)
              - materials   (list of str)
    """
    prompt = get_projects_prompt(material, quantity, user_interest)
    raw = _call_gemini(prompt)
    projects = _extract_json(raw)

    if not isinstance(projects, list):
        raise ValueError("Expected a JSON array of projects from Gemini.")

    return projects


def get_project_tutorial(project_title: str) -> dict:
    """
    Fetch step-by-step instructions and YouTube search links for a project.

    Args:
        project_title (str): The project title to get a tutorial for

    Returns:
        dict with:
            - project_title (str)
            - steps         (list of str)
            - youtube_links (list of dicts with 'label' and 'url')
    """
    prompt = get_tutorial_prompt(project_title)
    raw = _call_gemini(prompt)
    tutorial = _extract_json(raw)

    if not isinstance(tutorial, dict):
        raise ValueError("Expected a JSON object for the tutorial from Gemini.")

    return tutorial


# ─────────────────────────────────────────────
# Terminal Display Helpers
# ─────────────────────────────────────────────

def _print_divider(char="─", width=60):
    print(char * width)


def _display_projects(projects: list):
    """Pretty-print the list of projects."""
    _print_divider()
    print("♻️   HERE ARE YOUR REUSE IDEAS")
    _print_divider()
    for i, p in enumerate(projects, 1):
        print(f"\n  [{i}] {p.get('title', 'Untitled')}")
        print(f"      {p.get('description', '')}")
        mats = p.get("materials", [])
        if mats:
            print(f"      🔧 Materials: {', '.join(mats)}")
    _print_divider()


def _display_tutorial(tutorial: dict):
    """Pretty-print the tutorial instructions and links."""
    _print_divider("═")
    print(f"📋  TUTORIAL: {tutorial.get('project_title', '')}")
    _print_divider("═")

    steps = tutorial.get("steps", [])
    if steps:
        print("\n🛠️  Step-by-step Instructions:\n")
        for step in steps:
            print(f"   {step}")

    links = tutorial.get("youtube_links", [])
    if links:
        print("\n🎬  YouTube Tutorial Links:\n")
        for link in links:
            label = link.get("label", "Watch tutorial")
            url = link.get("url", "#")
            print(f"   ▶  {label}")
            print(f"      {url}\n")
    _print_divider("═")


# ─────────────────────────────────────────────
# Main Terminal Flow
# ─────────────────────────────────────────────

def main():
    """Interactive terminal demo for the AI Reuse Recommendation module."""
    print()
    _print_divider("═")
    print("  🌿  AI WASTE REUSE RECOMMENDER  — powered by Gemini 2.5 Flash")
    _print_divider("═")
    print()

    # 1. Ask for material
    material = input("  Enter waste material (e.g., plastic bottle, cardboard): ").strip()
    if not material:
        print("  ⚠️  Material cannot be empty. Exiting.")
        return

    # 2. Ask for quantity
    qty_str = input("  How many items do you have? (e.g., 5): ").strip()
    try:
        quantity = int(qty_str)
        if quantity <= 0:
            raise ValueError
    except ValueError:
        print("  ⚠️  Invalid quantity. Please enter a positive integer. Exiting.")
        return

    # 3. Ask for optional suggestion
    suggestion = input("  Do you have something in mind to build? (e.g., a lamp, storage box — press Enter to skip): ").strip()
    user_interest = suggestion if suggestion else None

    # 4. Show project ideas
    hint = f" with your idea: '{user_interest}'" if user_interest else ""
    print(f"\n  🤖  Asking Gemini to suggest projects for {quantity}x '{material}'{hint}...\n")
    try:
        projects = get_reuse_projects(material, quantity, user_interest)
    except Exception as e:
        print(f"  ❌  Failed to get projects: {e}")
        return

    _display_projects(projects)

    # 4. Allow user to select one
    print()
    pick_str = input(
        f"  Pick a project number [1–{len(projects)}] for step-by-step instructions (or 'q' to quit): "
    ).strip()

    if pick_str.lower() == "q":
        print("\n  👋  Thanks for using the AI Reuse Recommender! Reduce, Reuse, Recycle! ♻️\n")
        return

    try:
        pick = int(pick_str)
        if pick < 1 or pick > len(projects):
            raise ValueError
    except ValueError:
        print(f"  ⚠️  Invalid choice. Please enter a number between 1 and {len(projects)}.")
        return

    chosen = projects[pick - 1]
    print(f"\n  🤖  Fetching tutorial for: '{chosen['title']}'...\n")

    # 5. Show instructions and tutorial links
    try:
        tutorial = get_project_tutorial(chosen["title"])
    except Exception as e:
        print(f"  ❌  Failed to get tutorial: {e}")
        return

    _display_tutorial(tutorial)
    print("\n  👋  Happy building! Remember to reduce, reuse, and recycle! ♻️\n")


if __name__ == "__main__":
    main()