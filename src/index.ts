export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const prompt = url.searchParams.get("prompt");

    if (prompt) {
      const inputs = { prompt };

      const image = await env.AI.run(
        "@cf/stabilityai/stable-diffusion-xl-base-1.0",
        inputs
      );

      return new Response(image, {
        headers: { "content-type": "image/png" },
      });
    }

    // Serve static files from the public folder, including index.html
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
