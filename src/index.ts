export default {
  async fetch(request, env) {
    try {
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

      // Serve static files
      return env.ASSETS.fetch(request);
    } catch (e) {
      return new Response(`Error: ${e.message}`, { status: 500 });
    }
  },
} satisfies ExportedHandler<Env>;
