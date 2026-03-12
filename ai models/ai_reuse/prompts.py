"""
Prompt templates for the AI Reuse Recommendation module.
"""


def get_projects_prompt(material: str, quantity: int, user_interest: str | None = None) -> str:
    """
    Builds the prompt for generating reuse project ideas.
    """
    interest_clause = ""
    if user_interest:
        interest_clause = f"\nThe user already has something in mind: \"{user_interest}\". Try to include or prioritise ideas related to this suggestion."

    return f"""You are a sustainability DIY assistant.
A user has {quantity} pieces of {material} waste.
Suggest 3-5 practical DIY reuse projects they can build using this material.{interest_clause}
For each project provide:
* title
* short description
* estimated materials required.

Return the response in JSON format as a JSON array only, with no markdown, no code fences, no extra text.
Each element must have:
  - "title": (string) name of the project
  - "description": (string) short explanation of the project
  - "materials": (array of strings) list of materials required

Example format:
[
  {{
    "title": "Cardboard storage organizer",
    "description": "Use cardboard sheets to build a drawer organizer.",
    "materials": ["cardboard", "glue", "scissors"]
  }}
]"""


def get_tutorial_prompt(project_title: str) -> str:
    """
    Builds the prompt for generating step-by-step instructions for a selected project.
    """
    return f"""Provide step-by-step instructions to build: {project_title}.
Also include 3 YouTube tutorial search links.

Return your response in ONLY valid JSON format (no markdown, no extra text, no code fences).
Use this exact structure:
{{
  "project_title": "{project_title}",
  "steps": [
    "Step 1: ...",
    "Step 2: ...",
    "Step 3: ..."
  ],
  "youtube_links": [
    {{
      "label": "Search: [descriptive video title]",
      "url": "https://www.youtube.com/results?search_query=..."
    }}
  ]
}}"""
