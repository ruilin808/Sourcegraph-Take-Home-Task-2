<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Atharva J Patel Inspired Movie Search</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'suit-gray': '#3A3A3A',
                        'shirt-white': '#F0F0F0',
                        'tie-black': '#1A1A1A',
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-suit-gray text-shirt-white font-['Poppins']">
    <div class="container mx-auto px-4 py-8">
        <header class="mb-12 text-center">
            <h1 class="text-4xl font-semibold mb-2">Atharva J Patel's Movie Explorer</h1>
            <p class="text-lg text-gray-300">Discover films with professional precision</p>
        </header>
        
        <div class="mb-8 flex">
            <input type="text" id="searchInput" placeholder="Search for movies..." 
                   class="flex-grow p-4 bg-tie-black text-shirt-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-shirt-white transition duration-300">
            <button id="searchButton" 
                    class="bg-shirt-white text-tie-black px-6 rounded-r-lg font-semibold hover:bg-gray-300 transition duration-300">
                Search
            </button>
        </div>
        
        <div id="results" class="mb-8 bg-tie-black p-6 rounded-lg shadow-lg hidden">
            <h2 class="text-2xl font-semibold mb-4">Search Results</h2>
            <ul id="resultsList" class="space-y-2"></ul>
        </div>
        
        <div class="bg-tie-black p-6 rounded-lg shadow-lg">
            <h2 class="text-2xl font-semibold mb-4">Top Ten Movies of the Week</h2>
            <ol id="topMovies" class="space-y-2 list-decimal list-inside"></ol>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const searchInput = document.getElementById('searchInput');
            const searchButton = document.getElementById('searchButton');
            const results = document.getElementById('results');
            const resultsList = document.getElementById('resultsList');
            const topMovies = document.getElementById('topMovies');

            // Fetch and populate top movies
            fetch('/top_movies')
                .then(response => response.json())
                .then(movies => {
                    movies.forEach(movie => {
                        const li = document.createElement('li');
                        li.textContent = movie;
                        li.className = 'py-2 px-4 hover:bg-suit-gray rounded transition duration-300';
                        topMovies.appendChild(li);
                    });
                });

            // Search functionality
            function performSearch() {
                const searchTerm = searchInput.value.toLowerCase();
                if (searchTerm.length > 2) {
                    fetch('/search', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({query: searchTerm}),
                    })
                    .then(response => response.json())
                    .then(data => displayResults(data));
                } else {
                    results.classList.add('hidden');
                }
            }

            // Attach search function to button click
            searchButton.addEventListener('click', performSearch);

            // Also allow search on Enter key press
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });

            function displayResults(movies) {
                resultsList.innerHTML = '';
                if (movies.length > 0) {
                    movies.forEach(movie => {
                        const li = document.createElement('li');
                        li.textContent = movie;
                        li.className = 'py-2 px-4 hover:bg-suit-gray rounded transition duration-300';
                        resultsList.appendChild(li);
                    });
                    results.classList.remove('hidden');
                } else {
                    results.classList.add('hidden');
                }
            }

            // Add a subtle animation to the search input
            searchInput.addEventListener('focus', () => {
                searchInput.classList.add('scale-105');
            });

            searchInput.addEventListener('blur', () => {
                searchInput.classList.remove('scale-105');
            });
        });
    </script>
</body>
</html>