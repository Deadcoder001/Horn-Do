<div align="center">
  <img src="https://img.shields.io/badge/Next.js_16-Black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Vercel_KV-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel KV" />

  <br />
  <br />

  <h1>🚛 हॉर्न do (Horn OK Please)</h1>
  
  <p>
    <strong>A cinematic music streaming experience designed for endless roads and nostalgic memories.</strong>
  </p>

  <p>
    <a href="https://horn-do.vercel.app">View Live Demo</a>
    ·
    <a href="https://github.com/Deadcoder001/Horn-Do/issues">Report Bug</a>
    ·
    <a href="https://github.com/Deadcoder001/Horn-Do/issues">Request Feature</a>
  </p>
</div>

---

## 🌟 About The Project

**हॉर्न do** is not just a music player—it's an interactive, aesthetic journey. Inspired by premium automotive dashboards, high-end audio interfaces, and the cultural essence of Indian highways, this application delivers a highly polished, immersive listening experience. 

It combines cinematic video backgrounds, silky smooth animations, and multiplayer-like presence features so you never feel like you're driving alone.

### ✨ Key Features

* 🎵 **Custom Mixtapes**: Build and save your own personal mixtapes entirely in the browser using YouTube URLs. Stored locally via `IndexedDB` so they never disappear.
* 👥 **Live Active Listeners**: Powered by **Vercel KV**, see exactly how many people are enjoying the vibes with you in real-time.
* 🌌 **Interactive Mouse Parallax**: The entire background reacts to your cursor movements, creating a stunning 3D depth-of-field effect (can be toggled in settings).
* 🎛 **Glassmorphic Media Dock**: A responsive, buttery-smooth floating music player with full playback controls, shuffle, loop, and track navigation.
* 📺 **Picture-in-Picture Mode**: Watch the music video in a draggable, floating mini-player while you navigate other apps or tabs.
* 🕰 **Minimalist Apple-style Clock**: A beautiful, real-time minimalist clock perfectly centered in your dashboard.
* ✍️ **Truck Shayari**: Rotating, nostalgic, and sometimes funny Indian Truck quotes ("Shayari") that automatically cycle every 15 seconds.
* 🖼 **Custom Backgrounds**: Upload your own image or video backgrounds.
* 📱 **Perfectly Mobile Responsive**: Designed to look incredible whether you are on a massive 4K monitor or an iPhone SE.

---

## 🛠 Built With

This project pushes the boundaries of modern frontend web development.

* **[Next.js 16 (App Router)](https://nextjs.org/)**
* **[React 19](https://react.dev/)**
* **[Tailwind CSS](https://tailwindcss.com/)**
* **[Framer Motion](https://www.framer.com/motion/)** (For fluid animations and physics-based interactions)
* **[Vercel KV (Redis)](https://vercel.com/storage/kv)** (For serverless real-time presence)
* **[idb-keyval](https://github.com/jakearchibald/idb-keyval)** (For robust IndexedDB local storage)
* **[React Player](https://github.com/CookPete/react-player)** (For YouTube audio/video streaming)

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
* Node.js 18.x or higher
* npm

### Installation

1. **Clone the repo**
   ```sh
   git clone https://github.com/Deadcoder001/Horn-Do.git
   ```
2. **Navigate to the directory**
   ```sh
   cd Horn-Do
   ```
3. **Install NPM packages**
   ```sh
   npm install
   ```
   *(Note: An `.npmrc` file is included to automatically handle any React 19 peer-dependency conflicts with legacy packages via `legacy-peer-deps=true`)*

4. **Set up Vercel KV (Optional for Local, Required for Production)**
   If you want the "Live Listeners" feature to work, you need to link a Vercel KV database and add your environment variables to a `.env.local` file:
   ```env
   KV_REST_API_URL="your-kv-url"
   KV_REST_API_TOKEN="your-kv-token"
   ```

5. **Run the Development Server**
   ```sh
   npm run dev
   ```
6. Open `http://localhost:3000` in your browser.

---

## 🎨 Customization

The default playlist is stored in `src/data/data.json`. You can easily swap out the tracks with your own favorite YouTube links. The UI and color palette can be modified inside `src/app/globals.css` and `tailwind.config.ts`.

---

## 👨‍💻 Author

**Ashif Elahi**

* Portfolio: [ashifelahi.netlify.app](https://ashifelahi.netlify.app)
* LinkedIn: [Ashif Elahi](https://www.linkedin.com/in/ashif-elahi-1740302b3)
* GitHub: [@Deadcoder001](https://github.com/Deadcoder001)

If you would like to extend this project, contribute, or collaborate, feel free to contact me via email at **asifelahi6@gmail.com**.

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="center">
  <i>"Keep Distance, OK Please!"</i>
</p>
