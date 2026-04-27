from flask import Flask, request, jsonify
from flask_cors import CORS
import anthropic
import os

app = Flask(__name__)
CORS(app)  # lets the React frontend talk to this server

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))


def build_prompt(raw_text, role):
    role_context = {
        "Software Engineering": "software engineer with experience in backend systems, APIs, and scalable architecture",
        "Data Science": "data scientist working with ML models, data pipelines, and analytics",
        "Web Development": "web developer building responsive interfaces and full-stack applications",
        "General": "professional looking for clean, impactful resume language"
    }

    context = role_context.get(role, role_context["General"])

    prompt = f"""You are helping a {context} rewrite rough job experience into polished resume bullet points.

Raw experience: "{raw_text}"

Write exactly 3 resume bullet points. Rules:
- Start each with a strong action verb (Built, Developed, Implemented, Designed, etc.)
- Include specific technologies or methods when you can infer them from context
- Keep each bullet to 1-2 lines max
- Make them sound like real human work, not marketing copy
- Do NOT number them, just start each on a new line with a dash (-)

Only return the 3 bullets, nothing else."""

    return prompt


@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()

    raw_text = data.get("raw_text", "").strip()
    role = data.get("role", "General")

    if not raw_text:
        return jsonify({"error": "No text provided"}), 400

    try:
        message = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=500,
            messages=[
                {"role": "user", "content": build_prompt(raw_text, role)}
            ]
        )

        bullets_raw = message.content[0].text.strip()
        # split into list, clean up empty lines
        bullets = [b.strip() for b in bullets_raw.split("\n") if b.strip()]

        return jsonify({"bullets": bullets})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
