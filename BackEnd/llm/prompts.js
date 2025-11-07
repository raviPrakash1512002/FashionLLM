/**
 * LLM prompt templates for text-query parsing and recommendations.
 * Keep prompts here so they are easy to edit and test independently of controllers.
 */
exports.buildTextQueryPrompt = (userQuery) => `Parse the following user query: "${userQuery}".
- Detect the target brand using regex:
  - "Peter England" -> matches any variation like "Peter england", "peter England", "peterengland","Peter","peter", "peter_engalnd", "peter england".
  - "Van Heusen" -> matches any variation like "Van", "van", "van heusen", "Vanheusen","heusen", "van hausen".
- Use the detected brand to decide:
  - ***If "Peter England" is detected, generate a MongoDB query for the "Items" collection and set SQL query to null.***
  - ***If "Van Heusen" is detected, generate an SQL query for the "Products" table and set MongoDB query to null.***
  - ***If no brand is detected(like "Peter England" or "Van Heusen"), generate queries for both databases.***
  - ***If an unrecognized brand("killer","levi's","H&M","Zara" etc....) is detected, respond with an error.***
- Exclude any mention of the brand as a filter in the generated queries.
- Include filters for:
  - Numeric conditions: "price less than 500", "price > 1000", "price between 500 and 1500".
  - Exact matches: "size L", "color white".
  - Logical combinations: "size L and color white".
- Respond strictly in JSON format:
{
  "mysql": "<SQL query or null>",
  "mongodb": "<MongoDB query or null>"
}

**Examples**:
1. Query: "Find white shirts size L price <2000 from Peter England"
Output:
{
  "mysql": null,
  "mongodb": {"category": {"$regex": "^shirts$", "$options": "i"}, "size": {"$regex": "^L$", "$options": "i"}, "color": {"$regex": "^white$", "$options": "i"}, "price": {"$lt": 2000}}
}

2. Query: "Get jackets size M price >1000 from Van Heusen"
Output:
{
  "mysql": "SELECT * FROM products WHERE category='jackets' AND size='M' AND price > 1000;",
  "mongodb": null
}

3. Query: "Show jeans size 32 price 500 to 1500"
Output:
{
  "mysql": "SELECT * FROM products WHERE category='jeans' AND size='32' AND price >= 500 AND price <= 1500;",
  "mongodb": {"category": {"$regex": "^jeans$", "$options": "i"}, "size": {"$regex": "^32$", "$options": "i"}, "price": {"$gte": 500, "$lte": 1500}}
}

4. Query: "Find shirts"
Output:
{
  "mysql": "SELECT * FROM products WHERE category='shirts';",
  "mongodb": {"category": {"$regex": "^shirts$","$options": "i"}}
}

Ensure the brand name is not included as a filter in either SQL or MongoDB queries. Ensure the response is valid JSON and ends after the closing brace.
`;

exports.buildRecommendationPrompt = (userQuery) => `Based on the user query: "${userQuery}":\nProvide concise recommendations: trend analysis, 3 outfit suggestions, color matching, sizing tips, and a one-line brand insight if a known brand is detected. Keep it to five sentences.`;
