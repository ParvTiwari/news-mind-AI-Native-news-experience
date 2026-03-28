require('dotenv').config();
const { generateSummary } = require('./ai.service');

(async () => {
  const sample = {
    title: 'Market closes higher as AI stocks rally',
    description: 'Investors rotated into large-cap AI names.',
    content: 'The S&P 500 closed up 1.2% as semiconductor stocks led gains.',
    source: 'Sample'
  };

  const output = await generateSummary(sample);
  console.log(output);
})();
