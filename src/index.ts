export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const prompt = url.searchParams.get("prompt");

    if (prompt) {
      // Generate the image for the prompt
      try {
        const imageResponse = await env.AI.run(
          "@cf/stabilityai/stable-diffusion-xl-base-1.0",
          { prompt }
        );

        return new Response(imageResponse, {
          headers: {
            "content-type": "image/png",
          },
        });
      } catch (e) {
        return new Response(`Error generating image: ${e.message}`, {
          status: 500,
        });
      }
    } else {
      // Return the HTML page with input box
      return new Response(`
        <html>
          <body>
            <form>
              <input name="prompt" placeholder="Enter prompt" />
              <button type="submit">Generate</button>
            </form>
          </body>
        </html>`, {
        headers: {
          "content-type": "text/html",
        },
      });
    }
  },
};
