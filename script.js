const popularMovies = [
  "Vingadores: Ultimato",
  "Titanic",
  "Avatar",
  "Pantera Negra",
  "Homem-Aranha: Sem Volta Para Casa",
  "Jurassic Park",
  "O Rei Leão",
  "Frozen",
  "Toy Story",
  "Procurando Nemo",
  "Shrek",
  "Harry Potter",
  "Senhor dos Anéis",
  "Star Wars",
  "Matrix",
  "Pulp Fiction",
  "Forrest Gump",
  "O Poderoso Chefão",
  "Cidade de Deus",
  "Parasita",
  "Coringa",
  "Interestelar",
  "Inception",
  "Gladiador",
  "O Cavaleiro das Trevas",
  "Clube da Luta",
  "Seven",
  "Goodfellas",
  "Scarface",
  "Taxi Driver",
  "Casablanca",
  "Cidadão Kane",
  "Psicose",
  "Vertigo",
  "Cantando na Chuva",
  "E.T.",
  "Tubarão",
  "Rocky",
  "Rambo",
  "Terminator",
  "Alien",
  "Blade Runner",
  "Mad Max",
  "John Wick",
  "Velozes e Furiosos",
  "Missão Impossível",
  "James Bond",
  "Indiana Jones",
  "Piratas do Caribe",
  "Transformers",
]

const API_BASE_URL = "http://localhost:3000" 

class MovieRandomizer {
  constructor() {
    this.randomizeBtn = document.getElementById("randomizeBtn")
    this.btnText = document.querySelector(".btn-text")
    this.btnLoader = document.getElementById("btnLoader")
    this.movieCard = document.getElementById("movieCard")
    this.errorMessage = document.getElementById("errorMessage")

    this.init()
  }

  init() {
    this.randomizeBtn.addEventListener("click", () => this.randomizeMovie())
  }

  async randomizeMovie() {
    this.showLoading()
    this.hideElements()

    try {
      const randomMovie = popularMovies[Math.floor(Math.random() * popularMovies.length)]
      const response = await fetch(`${API_BASE_URL}/filme/${encodeURIComponent(randomMovie)}`)

      if (!response.ok) {
        throw new Error("Filme não encontrado")
      }

      const movieData = await response.json()
      this.displayMovie(movieData)
    } catch (error) {
      console.error("Erro ao buscar filme:", error)
      this.showError()
    } finally {
      this.hideLoading()
    }
  }

  displayMovie(movie) {
    document.getElementById("movieTitle").textContent = movie.titulo
    document.getElementById("movieRating").textContent = `⭐ ${movie.nota.toFixed(1)}`

    const releaseYear = new Date(movie.lancamento).getFullYear()
    document.getElementById("movieYear").textContent = releaseYear

    document.getElementById("movieSynopsis").textContent = movie.sinopse || "Sinopse não disponível."

    const posterImg = document.getElementById("moviePoster")
    if (movie.poster) {
      posterImg.src = movie.poster
      posterImg.alt = `Poster de ${movie.titulo}`
    } else {
      posterImg.src = "/movie-poster-placeholder.png"
      posterImg.alt = "Poster não disponível"
    }

    this.displayWatchProviders(movie.onde_assistir)

    this.movieCard.style.display = "grid"
  }

  displayWatchProviders(providers) {
    const whereToWatchDiv = document.getElementById("whereToWatch")
    whereToWatchDiv.innerHTML = ""

    if (!providers || Object.keys(providers).length === 0) {
      whereToWatchDiv.innerHTML =
        '<p style="color: var(--muted-foreground); font-size: 0.875rem;">Informações de streaming não disponíveis</p>'
      return
    }

    const title = document.createElement("h3")
    title.textContent = "Onde assistir:"
    whereToWatchDiv.appendChild(title)

    const providersContainer = document.createElement("div")
    providersContainer.className = "providers"

    const allProviders = new Set()

    if (providers.flatrate) {
      providers.flatrate.forEach((provider) => allProviders.add(provider.provider_name))
    }
    if (providers.rent) {
      providers.rent.forEach((provider) => allProviders.add(provider.provider_name))
    }
    if (providers.buy) {
      providers.buy.forEach((provider) => allProviders.add(provider.provider_name))
    }

    if (allProviders.size > 0) {
      allProviders.forEach((providerName) => {
        const providerSpan = document.createElement("span")
        providerSpan.className = "provider"
        providerSpan.textContent = providerName
        providersContainer.appendChild(providerSpan)
      })
    } else {
      providersContainer.innerHTML = '<span class="provider">Não disponível no Brasil</span>'
    }

    whereToWatchDiv.appendChild(providersContainer)
  }

  showLoading() {
    this.randomizeBtn.disabled = true
    this.btnText.classList.add("hidden")
    this.btnLoader.classList.add("active")
  }

  hideLoading() {
    this.randomizeBtn.disabled = false
    this.btnText.classList.remove("hidden")
    this.btnLoader.classList.remove("active")
  }

  hideElements() {
    this.movieCard.style.display = "none"
    this.errorMessage.style.display = "none"
  }

  showError() {
    this.errorMessage.style.display = "block"
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new MovieRandomizer()
})
