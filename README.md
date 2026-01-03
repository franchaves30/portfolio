# Fran Chaves — Growth & PM Portfolio

> "I bridge the gap between Business Strategy and Engineering. I don't just ask for features; I build them."

This is a full-stack AI application built to serve as my professional portfolio and digital twin. It demonstrates my ability to combine product-led growth strategy with hands-on technical implementation.

## 🤖 The AI Digital Twin
The core of this portfolio is an interactive AI assistant trained on my real career data, metrics, and philosophy. 
- **Text Chat**: A RAG-powered interface using **Next.js**, **FastAPI**, and **LangChain**.
- **Voice Mode**: A low-latency conversational agent powered by **ElevenLabs**.

## 🛠 Tech Stack
- **Frontend**: Next.js 16 (React 19 + Turbopack), Tailwind CSS, Framer Motion.
- **Backend**: FastAPI (Python), LangChain.
- **AI/LLMs**: OpenAI (GPT-4o-mini), ElevenLabs (Voice AI).
- **Deployment**: Vercel.
- **Monitoring**: Vercel Analytics & Speed Insights.

## 🚀 Case Studies & Builds
- **How I built this Portfolio**: A deep dive into the architecture of this site.
- **Product-Led Growth**: Examples of building sidecar products that drive organic B2B leads.
- **Operational Leverage**: How I built a "Warehouse OS" to scale operations.

---

## 💻 Local Development

1. **Clone the repo**
2. **Backend Setup**:
   - `cd api`
   - `python3 -m venv venv && source venv/bin/activate`
   - `pip install -r requirements.txt`
3. **Frontend Setup**:
   - `pnpm install`
4. **Environment Variables**:
   - Set `OPENAI_API_KEY` and `ELEVENLABS_API_KEY` in `.env.local`.
5. **Run**:
   - `pnpm dev`

## Learn More
- Connect on [LinkedIn](https://www.linkedin.com/in/fran-chaves/)
- Check out the [Case Studies](https://franchaves.com/case-studies)
