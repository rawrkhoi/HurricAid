let watsonCategories = {
  foodInfo: {
    keywords: ['food industry', 'food and drink', 'hospitality industry', 'nutrition'],
    table: 'Food',
  },
  waterInfo: {
    keywords: ['bottled water', 'metals', 'water', 'freshwater'],
    table: 'Water',
  },
  shelterInfo: {
    // we may want to change the 'welfare' one to move it somewhere else
    keywords: ['hotels', 'law, government, and politics', 'apartments', 'society/crime', 'budget travel', 'social services', 'sleep', 'bed and bath'],
    table: 'Shelter',
  },
  equipmentInfo: {
    keywords: ['construction', 'gardening and landscaping', 'home improvement and repair', 'remodeling and construction', 'sports', 'homicide'],
    table: 'Equipment',
  },
  clothingInfo: {
    keywords: ['accessories', 'fashion industry', 'clothing', 'footwear', 'underwear'],
    table: 'Clothing',
  },
  powerInfo: {
    keywords: ['energy', 'electricity', 'technology and computing'],
    table: 'Power',
  },
  petInfo: {
    keywords: ['pets'],
    table: 'Pet',
  },
  transportationInfo: {
    keywords: ['automotive and vehicles', 'transports'],
    table: 'Transportation',
  },
  healthInfo: {
    keywords: ['disease', 'disorders', 'pregnancy', 'dental care', 'women\'s health', 'drugs', 'therapy', 'medicine', 'healthcare', 'beauty'],
    table: 'Health',
  },
  householdInfo: {
    keywords: ['appliances', 'laundry', 'pest control'],
    table: 'Household',
  },
}

module.exports = {
  watsonCategories
}