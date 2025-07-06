module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // .env dosyasındaki değişkenleri (@env ile) projede kullanabilmek için gerekli plugin
    plugins: [
      ["module:react-native-dotenv", {
        "moduleName": "@env",
        "path": ".env",
      }]
    ]
  };
};