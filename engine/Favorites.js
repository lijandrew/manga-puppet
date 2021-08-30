const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const Settings = require("./Settings.js");

const favoritesPath = path.join(__dirname, "..", "favorites.json");
if (!fs.existsSync(favoritesPath)) {
  console.log("Writing file");
  fs.writeFileSync(favoritesPath, JSON.stringify({}));
}
const favorites = JSON.parse(fs.readFileSync(favoritesPath));

const Favorites = {
  getFavorites() {
    return favorites;
  },

  syncFavorites() {
    fs.writeFileSync(favoritesPath, JSON.stringify(favorites));
  },

  deleteFavorite(uuid) {
    delete favorites[uuid];
    this.syncFavorites();
  },

  addFavorite(favorite) {
    favorites[uuidv4()] = favorite;
    this.syncFavorites();
  },
};

module.exports = Favorites;
