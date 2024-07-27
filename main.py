from flask import Flask, render_template, request, jsonify
from model import load_model_and_tokenizer, generate_text

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    model, tokenizer, device = load_model_and_tokenizer()
    query = request.json['query']
    # Use the callModel function
    results = generate_text(query, model, tokenizer, device)
    print(generate_text)
    return jsonify(results)

@app.route('/top_movies')
def top_movies():
    top_movies = [
        "The Corporate Ladder", "Suit Up", "Boardroom Drama", "The Consultant",
        "Professional Ethics", "The Merger", "Executive Decision", "Corporate Espionage",
        "The CEO", "Business Class"
    ]
    return jsonify(top_movies)

if __name__ == '__main__':
    app.run(debug=True)