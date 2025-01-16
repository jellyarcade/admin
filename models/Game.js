const gameSchema = new Schema({
  // ... diğer alanlar
  isShowcased: { type: Boolean, default: false },
  showcasedCategories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  isHomePageShowcased: { type: Boolean, default: false },
});
