// Text chat prompt
const chatPrompt = message => `You are NutriBot, a helpful nutrition assistant.
User Message: "${message}"

Respond in valid JSON format ONLY:
{
  "text": "Your helpful response text here...",
  "report": { // Optional: include ONLY if user describes a specific meal to analyze
     "carbs": 0,
     "protein": 0,
     "fats": 0
  },
  "healthTip": "Optional: A short, actionable health tip if relevant (e.g. 'Drink water before meals').",
  "info": "Optional: Fun fact or verified nutritional fact if relevant."
}

Rules:
- If user describes food (e.g. "I ate pizza"), provide "report".
- If user asks for advice/tips, provide "healthTip".
- Keep "text" concise.
- Don't force a report if not applicable.
`;

// Image analysis prompt
const analysisPrompt =
  quantity => `Analyze this food image thoroughly. Identify the food item(s).
    
User Context/Quantity provided: "${quantity}".
If the user provided a quantity, USE IT as the ground truth for your nutritional calculations.

Estimate the quantity (e.g., number of pieces, number of bowls) if not provided, and provide a complete and DETAILED nutritional breakdown.

Return ONLY valid JSON in the following format (all numeric values MUST be numbers, not strings):
{
  "foodName": "...",
    "servingSize": "...",
  "isHealthy": true/false,
  "calories": 0,
  "macronutrients": {
    "protein": 0,
    "carbs": 0,
    "fat": 0,
    "fiber": 0,
    "sugar": 0
  },
  "micronutrients": {
    "sodium": 0,
    "cholesterol": 0,
    "vitaminA": 0,
    "vitaminC": 0,
    "calcium": 0,
    "iron": 0,
    "potassium": 0,
    "magnesium": 0,
    "zinc": 0,
    "vitaminD": 0,
    "vitaminB12": 0
  },
  "nutritionBreakdown": {
    "proteinPercent": 0,
    "carbsPercent": 0,
    "fatPercent": 0
  },
  "healthMetrics": {
    "healthScore": 0,
    "benefits": ["...", "..."],
    "concerns": ["...", "..."]
  },
  "analysis": "Detailed analysis of the food's nutritional value, preparation method, and health implications (2-3 sentences)",
  "recommendation": "What to eat next to balance this meal nutritionally (be specific with food suggestions)"
}
   }
Notes:
- All gram values should be in grams (g)
- Vitamins and minerals in milligrams (mg) or appropriate units (mcg for certain vitamins if standard, but preferably normalize to mg or specify unit if implicit constraints allow - however schema implies Number so stick to standard numerical values, e.g. mg for Sodium/Potassium/Calcium/Iron/Magnesium/Zinc. Vitamin A/D/B12/C usually mg or mcg. Provide best estimate in standard units.)
- Percentages should be whole numbers (0-100)
- healthScore should be 0-100
- Be accurate with portion size estimation based on the User Context provided.
- Provide NON-ZERO estimates for micronutrients if reasonable trace amounts exist. Do not just zero them out unless completely absent.`;

module.exports = {
  chatPrompt,
  analysisPrompt,
};
