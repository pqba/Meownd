# Meownd

This project uses the [CatAPI](https://thecatapi.com) to dynamically generate cat images and facts by breed along with stories created by Gemini's multimodal AI.

## Technologies

- NodeJS (express, axios, cors)
- Gemini
- Cat API


## Run

- Install [nodeJS](https://nodejs.org/en/download/prebuilt-installer/current)
- Acquire required packages found in **package.json** with  `npm install {pkg}`
- [Get an API key](https://thecatapi.com/signup) from CatAPI
- Execute backend

**Mac & Linux**
```bash
CAT_API={key} GENAI_KEY={key} node src/backend.js
```
**Windows**
```bash
$env:CAT_API={key}
$env:GENAI_KEY={key}
node .\src\backend.js
```
- Open **CatMe.html** in a web browser on the same computer

## In Development
- Generate new stories, see them in real time through text prompt streaming


## License

This project uses the MIT License
