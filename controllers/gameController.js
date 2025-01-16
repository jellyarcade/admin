const gameData = {
  // ... diğer alanlar
  isShowcased: req.body.isShowcased === 'true',
  showcasedCategories: JSON.parse(req.body.showcasedCategories || '[]'),
  isHomePageShowcased: req.body.isHomePageShowcased === 'true',
};
