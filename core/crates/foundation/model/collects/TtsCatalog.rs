pub const TTS_CATALOG_VOICE_ROWS: &str = r#"
SYSTEM_TTS|||System default voice|Uses the system default language and default voice
OPENAI_COMPATIBLE||alloy|Alloy|Neutral, balanced voice
OPENAI_COMPATIBLE||ash|Ash|Deep, natural voice
OPENAI_COMPATIBLE||ballad|Ballad|Narrative voice
OPENAI_COMPATIBLE||coral|Coral|Bright, natural voice
OPENAI_COMPATIBLE||echo|Echo|Clear male voice
OPENAI_COMPATIBLE||fable|Fable|Storytelling voice
OPENAI_COMPATIBLE||nova|Nova|Clear female voice
OPENAI_COMPATIBLE||onyx|Onyx|Deep male voice
OPENAI_COMPATIBLE||sage|Sage|Steady, natural voice
OPENAI_COMPATIBLE||shimmer|Shimmer|Lively female voice
OPENAI_COMPATIBLE||verse|Verse|Expressive voice
MINIMAX_TTS|speech-2.8-hd|male-qn-qingse|Youthful male voice|MiniMax clear male voice
MINIMAX_TTS|speech-2.8-hd|male-qn-jingying|Elite male voice|MiniMax steady male voice
MINIMAX_TTS|speech-2.8-hd|female-shaonv|Young girl voice|MiniMax Chinese female voice
MINIMAX_TTS|speech-2.8-hd|female-yujie|Mature female voice|MiniMax mature female voice
MINIMAX_TTS|speech-2.8-hd|presenter_male|Male host|MiniMax male host voice
MINIMAX_TTS|speech-2.8-hd|presenter_female|Female host|MiniMax female host voice
MIMO_TTS|mimo-v2.5-tts|mimo_default|MiMo Default|MiMo default voice
MIMO_TTS|mimo-v2.5-tts|冰糖|Rock Sugar|MiMo Chinese female voice
MIMO_TTS|mimo-v2.5-tts|茉莉|Jasmine|MiMo Chinese female voice
MIMO_TTS|mimo-v2.5-tts|苏打|Soda|MiMo Chinese male voice
MIMO_TTS|mimo-v2.5-tts|白桦|White Birch|MiMo Chinese male voice
MIMO_TTS|mimo-v2.5-tts|Mia|Mia|MiMo English female voice
MIMO_TTS|mimo-v2.5-tts|Chloe|Chloe|MiMo English female voice
MIMO_TTS|mimo-v2.5-tts|Milo|Milo|MiMo English male voice
MIMO_TTS|mimo-v2.5-tts|Dean|Dean|MiMo English male voice
SILICONFLOW_TTS|FunAudioLLM/CosyVoice2-0.5B|FunAudioLLM/CosyVoice2-0.5B:alex|Alex|SiliconFlow CosyVoice2 male voice
SILICONFLOW_TTS|FunAudioLLM/CosyVoice2-0.5B|FunAudioLLM/CosyVoice2-0.5B:anna|Anna|SiliconFlow CosyVoice2 female voice
SILICONFLOW_TTS|FunAudioLLM/CosyVoice2-0.5B|FunAudioLLM/CosyVoice2-0.5B:bella|Bella|SiliconFlow CosyVoice2 female voice
SILICONFLOW_TTS|FunAudioLLM/CosyVoice2-0.5B|FunAudioLLM/CosyVoice2-0.5B:benjamin|Benjamin|SiliconFlow CosyVoice2 male voice
SILICONFLOW_TTS|FunAudioLLM/CosyVoice2-0.5B|FunAudioLLM/CosyVoice2-0.5B:charles|Charles|SiliconFlow CosyVoice2 male voice
SILICONFLOW_TTS|FunAudioLLM/CosyVoice2-0.5B|FunAudioLLM/CosyVoice2-0.5B:claire|Claire|SiliconFlow CosyVoice2 female voice
SILICONFLOW_TTS|FunAudioLLM/CosyVoice2-0.5B|FunAudioLLM/CosyVoice2-0.5B:david|David|SiliconFlow CosyVoice2 male voice
SILICONFLOW_TTS|FunAudioLLM/CosyVoice2-0.5B|FunAudioLLM/CosyVoice2-0.5B:diana|Diana|SiliconFlow CosyVoice2 female voice
ELEVENLABS_TTS|eleven_multilingual_v2|21m00Tcm4TlvDq8ikWAM|Rachel|ElevenLabs English female voice
ELEVENLABS_TTS|eleven_multilingual_v2|EXAVITQu4vr4xnSDxMaL|Bella|ElevenLabs English female voice
ELEVENLABS_TTS|eleven_multilingual_v2|ErXwobaYiN019PkySvjV|Antoni|ElevenLabs English male voice
ELEVENLABS_TTS|eleven_multilingual_v2|MF3mGyEYCl7XYWbV9V6O|Elli|ElevenLabs English female voice
ELEVENLABS_TTS|eleven_multilingual_v2|TxGEqnHWrfWFTfGW9XjX|Josh|ElevenLabs English male voice
ELEVENLABS_TTS|eleven_multilingual_v2|VR6AewLTigWG4xSOukaG|Arnold|ElevenLabs English male voice
ELEVENLABS_TTS|eleven_multilingual_v2|pNInz6obpgDQGcFmaJgB|Adam|ElevenLabs English male voice
ELEVENLABS_TTS|eleven_multilingual_v2|yoZ06aMxZJJ28mfd3POQ|Sam|ElevenLabs English male voice
DOUBAO_TTS||BV700_V2_streaming|Doubao default voice|Volcano Engine default Chinese voice
DEEPGRAM_TTS|aura-2-thalia-en||Thalia|Deepgram Aura 2 English female voice
DEEPGRAM_TTS|aura-2-andromeda-en||Andromeda|Deepgram Aura 2 English female voice
DEEPGRAM_TTS|aura-2-apollo-en||Apollo|Deepgram Aura 2 English male voice
DEEPGRAM_TTS|aura-2-arcas-en||Arcas|Deepgram Aura 2 English male voice
DEEPGRAM_TTS|aura-2-asteria-en||Asteria|Deepgram Aura 2 English female voice
DEEPGRAM_TTS|aura-2-orpheus-en||Orpheus|Deepgram Aura 2 English male voice
GROQ_TTS|playai-tts|Arista-PlayAI|Arista|Groq PlayAI female voice
GROQ_TTS|playai-tts|Basil-PlayAI|Basil|Groq PlayAI male voice
GROQ_TTS|playai-tts|Briggs-PlayAI|Briggs|Groq PlayAI male voice
GROQ_TTS|playai-tts|Calum-PlayAI|Calum|Groq PlayAI male voice
GROQ_TTS|playai-tts|Celeste-PlayAI|Celeste|Groq PlayAI female voice
GROQ_TTS|playai-tts|Cheyenne-PlayAI|Cheyenne|Groq PlayAI female voice
GROQ_TTS|playai-tts|Chip-PlayAI|Chip|Groq PlayAI male voice
GROQ_TTS|playai-tts|Cillian-PlayAI|Cillian|Groq PlayAI male voice
GROQ_TTS|playai-tts|Deedee-PlayAI|Deedee|Groq PlayAI female voice
GROQ_TTS|playai-tts|Fritz-PlayAI|Fritz|Groq PlayAI male voice
GROQ_TTS|playai-tts|Gail-PlayAI|Gail|Groq PlayAI female voice
GROQ_TTS|playai-tts|Indigo-PlayAI|Indigo|Groq PlayAI neutral voice
GROQ_TTS|playai-tts|Mamaw-PlayAI|Mamaw|Groq PlayAI female voice
GROQ_TTS|playai-tts|Mason-PlayAI|Mason|Groq PlayAI male voice
GROQ_TTS|playai-tts|Mikail-PlayAI|Mikail|Groq PlayAI male voice
GROQ_TTS|playai-tts|Mitch-PlayAI|Mitch|Groq PlayAI male voice
GROQ_TTS|playai-tts|Quinn-PlayAI|Quinn|Groq PlayAI neutral voice
GROQ_TTS|playai-tts|Thunder-PlayAI|Thunder|Groq PlayAI male voice
AZURE_TTS|zh-CN|zh-CN-XiaoxiaoNeural|Xiaoxiao|Azure Chinese female voice
AZURE_TTS|zh-CN|zh-CN-XiaoyiNeural|Xiaoyi|Azure Chinese female voice
AZURE_TTS|zh-CN|zh-CN-YunjianNeural|Yunjian|Azure Chinese male voice
AZURE_TTS|zh-CN|zh-CN-YunxiNeural|Yunxi|Azure Chinese male voice
AZURE_TTS|zh-CN|zh-CN-YunxiaNeural|Yunxia|Azure Chinese male voice
AZURE_TTS|zh-CN|zh-CN-YunyangNeural|Yunyang|Azure Chinese male voice
AZURE_TTS|en-US|en-US-JennyNeural|Jenny|Azure English female voice
AZURE_TTS|en-US|en-US-GuyNeural|Guy|Azure English male voice
AZURE_TTS|en-US|en-US-AriaNeural|Aria|Azure English female voice
AZURE_TTS|en-US|en-US-DavisNeural|Davis|Azure English male voice
GOOGLE_CLOUD_TTS|zh-CN|cmn-CN-Wavenet-A|Mandarin female voice A|Google Cloud Mandarin female voice
GOOGLE_CLOUD_TTS|zh-CN|cmn-CN-Wavenet-B|Mandarin male voice B|Google Cloud Mandarin male voice
GOOGLE_CLOUD_TTS|zh-CN|cmn-CN-Wavenet-C|Mandarin male voice C|Google Cloud Mandarin male voice
GOOGLE_CLOUD_TTS|zh-CN|cmn-CN-Wavenet-D|Mandarin female voice D|Google Cloud Mandarin female voice
GOOGLE_CLOUD_TTS|en-US|en-US-Neural2-C|English US C|Google Cloud American English female voice
GOOGLE_CLOUD_TTS|en-US|en-US-Neural2-D|English US D|Google Cloud American English male voice
GOOGLE_CLOUD_TTS|en-US|en-US-Neural2-F|English US F|Google Cloud American English female voice
GOOGLE_CLOUD_TTS|en-US|en-US-Neural2-J|English US J|Google Cloud American English male voice
GEMINI_TTS||Zephyr|Zephyr|Gemini bright voice
GEMINI_TTS||Puck|Puck|Gemini upbeat voice
GEMINI_TTS||Charon|Charon|Gemini informative voice
GEMINI_TTS||Kore|Kore|Gemini firm voice
GEMINI_TTS||Fenrir|Fenrir|Gemini excitable voice
GEMINI_TTS||Leda|Leda|Gemini youthful voice
GEMINI_TTS||Orus|Orus|Gemini steady voice
GEMINI_TTS||Aoede|Aoede|Gemini breezy voice
GEMINI_TTS||Callirrhoe|Callirrhoe|Gemini easygoing voice
GEMINI_TTS||Autonoe|Autonoe|Gemini bright, natural voice
GEMINI_TTS||Enceladus|Enceladus|Gemini breathy voice
GEMINI_TTS||Iapetus|Iapetus|Gemini clear voice
GEMINI_TTS||Umbriel|Umbriel|Gemini easygoing voice
GEMINI_TTS||Algieba|Algieba|Gemini smooth voice
GEMINI_TTS||Despina|Despina|Gemini soft voice
GEMINI_TTS||Erinome|Erinome|Gemini crystal-clear voice
GEMINI_TTS||Algenib|Algenib|Gemini raspy voice
GEMINI_TTS||Rasalgethi|Rasalgethi|Gemini information broadcast voice
GEMINI_TTS||Laomedeia|Laomedeia|Gemini lively, natural voice
GEMINI_TTS||Achernar|Achernar|Gemini soft, bright voice
GEMINI_TTS||Alnilam|Alnilam|Gemini firm, steady voice
GEMINI_TTS||Schedar|Schedar|Gemini balanced voice
GEMINI_TTS||Gacrux|Gacrux|Gemini mature voice
GEMINI_TTS||Pulcherrima|Pulcherrima|Gemini warm voice
GEMINI_TTS||Achird|Achird|Gemini friendly voice
GEMINI_TTS||Zubenelgenubi|Zubenelgenubi|Gemini casual voice
GEMINI_TTS||Vindemiatrix|Vindemiatrix|Gemini gentle voice
GEMINI_TTS||Sadachbia|Sadachbia|Gemini lively, upbeat voice
GEMINI_TTS||Sadaltager|Sadaltager|Gemini professional voice
GEMINI_TTS||Sulafat|Sulafat|Gemini warm voice
KOKORO_TTS||af_heart|AF Heart|Kokoro American English female voice
KOKORO_TTS||af_alloy|AF Alloy|Kokoro American English female voice
KOKORO_TTS||af_aoede|AF Aoede|Kokoro American English female voice
KOKORO_TTS||af_bella|AF Bella|Kokoro American English female voice
KOKORO_TTS||af_jessica|AF Jessica|Kokoro American English female voice
KOKORO_TTS||af_kore|AF Kore|Kokoro American English female voice
KOKORO_TTS||af_nicole|AF Nicole|Kokoro American English female voice
KOKORO_TTS||af_nova|AF Nova|Kokoro American English female voice
KOKORO_TTS||af_river|AF River|Kokoro American English female voice
KOKORO_TTS||af_sarah|AF Sarah|Kokoro American English female voice
KOKORO_TTS||af_sky|AF Sky|Kokoro American English female voice
KOKORO_TTS||am_adam|AM Adam|Kokoro American English male voice
KOKORO_TTS||am_echo|AM Echo|Kokoro American English male voice
KOKORO_TTS||am_eric|AM Eric|Kokoro American English male voice
KOKORO_TTS||am_fenrir|AM Fenrir|Kokoro American English male voice
KOKORO_TTS||am_liam|AM Liam|Kokoro American English male voice
KOKORO_TTS||am_michael|AM Michael|Kokoro American English male voice
KOKORO_TTS||am_onyx|AM Onyx|Kokoro American English male voice
KOKORO_TTS||am_puck|AM Puck|Kokoro American English male voice
KOKORO_TTS||bf_alice|BF Alice|Kokoro British English female voice
KOKORO_TTS||bf_emma|BF Emma|Kokoro British English female voice
KOKORO_TTS||bf_isabella|BF Isabella|Kokoro British English female voice
KOKORO_TTS||bf_lily|BF Lily|Kokoro British English female voice
KOKORO_TTS||bm_daniel|BM Daniel|Kokoro British English male voice
KOKORO_TTS||bm_fable|BM Fable|Kokoro British English male voice
KOKORO_TTS||bm_george|BM George|Kokoro British English male voice
KOKORO_TTS||bm_lewis|BM Lewis|Kokoro British English male voice
"#;
