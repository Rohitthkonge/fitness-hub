import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/dashboard.html", destination: "/dashboard", permanent: true },
      { source: "/workouts.html", destination: "/workouts", permanent: true },
      { source: "/nutrition.html", destination: "/nutrition", permanent: true },
      { source: "/bmi.html", destination: "/bmi", permanent: true },
      { source: "/progress.html", destination: "/progress", permanent: true },
      { source: "/ai-agent.html", destination: "/ai-agent", permanent: true },
      { source: "/ai-coach", destination: "/ai-agent", permanent: true },
      { source: "/ai-coach.html", destination: "/ai-agent", permanent: true },
    ];
  },
};

export default nextConfig;
