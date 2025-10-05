# 📦 ParcelOTW

ParcelOTW (Parcel On The Way) is a modern, responsive parcel tracking solution built with Next.js, designed to provide a seamless user experience with a clean and intuitive interface. Beyond its minimalistic design, it incorporates enhanced features that improve usability and ensure smooth navigation across devices of all sizes.

The system leverages the TrackingMore API, a trusted and scalable tracking service, to deliver accurate, real-time parcel information. Since the API itself is not free, basic features are unavailable, but you can explore and try the full implementation through the open-source code available on my [GitHub](https://github.com/Yapphy26). This integration ensures that users can reliably monitor shipments from multiple carriers through a single platform.

By combining performance-driven architecture with thoughtful UI/UX principles, ParcelOTW offers businesses and end-users a professional, efficient, and reliable way to stay informed about their deliveries.

![ParcelOTW Preview](/public/images/screenshots/homepage.png)

## ✨ Features

- **Minimalist UI** → Clean card-based layout for quick parcel status checks.
- **Subtle Animations** → Smooth bounce-in and loading transitions for a modern, dynamic feel.
- **Responsive Layout** → Optimized for desktop, tablet, and mobile with consistent design.
- **Seamless Tracking** → Real-time updates with clear, structured parcel information.
- **User-Focused Design** → Prioritizes simplicity, readability, and ease of navigation.

## 🛠 Tech Stack

- **Frameworks & UI** → Next.js, React, Tailwind CSS, shadcn/ui, Aceternity UI
- **Backend & Runtime** → Node.js, Next.js API Routes
- **Animations** → Framer Motion
- **APIs & Integrations** → TrackingMore API, Google SMTP
- **Validation** → Zod
- **Security** → Cloudflare Turnstile

## 🚀 Getting Started

### Prerequisites

- Next.js (v15.5.2 or later)
- Node.js (v18.18.0 or later)
- npm or yarn

### Installation with TrackingMore API Setup 🔑

1. Clone the repository

    ```bash
    git clone https://github.com/Yapphy26/parcelotw.git
    ```

2. Go into the project
    ```bash
    cd parcelotw
    ```

3. Install dependencies

    ```bash
    npm install
    # or
    yarn install
    ```

4. Go to the [TrackingMore Official Website](https://www.trackingmore.com/).

5. Sign in (or create an account if you don’t have one).

6. From the left sidebar, navigate to **Developer → API Key**.

7. Click **Generate API Key**.

8. Copy the key (you can also download the JSON file as a backup in case you forget it).

9. Back to the root of the `parcelotw` project, create a file named **`.env.local`**.

10. Add your API key (replace `YOUR_API_KEY`):

    ```bash
    TRACKINGMORE_API_KEY=YOUR_API_KEY
    ```

4. Run the app, start the development server

    ```bash
    npm run dev
    # or
    yarn dev
    ```

5. Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment

This site is deployed with Vercel.
To deploy your own version:

1. Push your code to GitHub
2. Connect the repo to Vercel
3. Vercel will build and deploy automatically

## 📄 License

This project is licensed under the [MIT License](LICENSE).