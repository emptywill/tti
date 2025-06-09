export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const prompt = url.searchParams.get("prompt");

    // If prompt is provided, generate image
    if (prompt) {
      const inputs = { prompt };

      const response = await env.AI.run(
        "@cf/stabilityai/stable-diffusion-xl-base-1.0",
        inputs
      );

      return new Response(response, {
        headers: { "content-type": "image/png" },
      });
    }

    // Otherwise, return the HTML page
    const html = await env.ASSETS.fetch(request);
    return html;
  },
} satisfies ExportedHandler<Env>;
