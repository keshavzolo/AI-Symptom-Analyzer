const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { authRequired, getUserFromRequest } = require('../middleware/auth');
const SearchHistory = require('../models/searchHistory');

router.post('/analyze-text', authRequired, async (req, res) => {
  const symptoms = req.body.symptoms;

  const prompt = `You are an advanced AI medical assistant.

Carefully analyze the user's symptoms and provide a clear, professional, and easy-to-understand medical assessment.

IMPORTANT RULES:
- Use simple language.
- Be concise but informative.
- Do NOT give dangerous medical advice.
- Mention emergency warning signs if symptoms are serious.
- Do NOT claim certainty.
- Format the response exactly as requested below.

User Symptoms:
${symptoms}

Provide the response in this exact format:

1. Possible Condition
- Mention the most likely condition(s).

2. Severity Level
- Mild / Moderate / Severe
- Brief explanation.

3. Recommended Action
- Suggest basic next steps.
- Mention if doctor consultation is needed.

4. Basic Precautions
- Hydration
- Rest
- Food precautions
- Hygiene tips
- Any useful safety advice

5. Emergency Warning Signs
- Mention dangerous symptoms that require immediate medical attention.

6. Disclaimer
- Clearly state that this is NOT professional medical advice.

Keep the response structured, clean, and beginner-friendly.

`;

  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'llava',
      prompt: prompt,
      stream: false
    });

    const user = await getUserFromRequest(req);
    if (user) {
      await SearchHistory.create({
        userId: user._id,
        username: user.username,
        searchType: 'text',
        query: symptoms,
        reply: response.data.response
      });
    }

    res.json({ reply: response.data.response });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Ollama error');
  }
});

router.post('/analyze-image', authRequired, upload.single('image'), async (req, res) => {
  const imagePath = req.file.path;
  const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });

  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'llava',
      prompt: 'Analyze this medical image and describe possible health issues.',
      images: [imageBase64],
      stream: false
    });

    const user = await getUserFromRequest(req);
    if (user) {
      await SearchHistory.create({
        userId: user._id,
        username: user.username,
        searchType: 'image',
        query: req.file.originalname || 'Uploaded medical image',
        reply: response.data.response
      });
    }

    fs.unlinkSync(imagePath);
    res.json({ reply: response.data.response });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Image analysis failed');
  }
});

module.exports = router;
