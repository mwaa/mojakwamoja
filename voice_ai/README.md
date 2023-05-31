### Speaker recognition api

---

A simple api using Nvidia AI toolkit NEMO. Api receives names of audio files uploaded to an s3 bucket and verifies that they belong to the same speaker.

```
Http-Method: POST
Endpoint: /voice-verify
Json Body: {
    "original": "first.wav",
    "redeeming": "mix.wav"
}
```

### Improvements

- Fine tune models per charity onboarding
- Speaker labelling during verification process to verify against label too

### Export current environment installs

pip list --format=freeze > requirements.txt
