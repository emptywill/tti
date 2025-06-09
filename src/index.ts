export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    // Serve the interactive HTML page for GET requests to "/"
    if (request.method === "GET" && url.pathname === "/") {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Text to Image Generator</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 600px; margin: 2rem auto; padding: 0 1rem; }
              input[type="text"] { width: 80%; padding: 0.5rem; font-size: 1rem; }
              button { padding: 0.5rem 1rem; font-size: 1rem; }
              img { max-width: 100%; margin-top: 1rem; border: 1px solid #ccc; }
              #error { color: red; }
            </style>
          </head>
          <body>
            <h1>Text to Image Generator</h1>
            <form id="generate-form">
              <input type="text" id="prompt" name="prompt" placeholder="Enter your prompt" required />
              <button type="submit">Generate</button>
            </form>
            <div id="error"></div>
            <div id="result"></div>

            <script>
              const form = document.getElementById('generate-form');
              const resultDiv = document.getElementById('result');
              const errorDiv = document.getElementById('error');

              form.addEventListener('submit', async (e) => {
                e.preventDefault();
                errorDiv.textContent = '';
                resultDiv.innerHTML = 'Generating image...';

                const prompt = document.getElementById('prompt').value.trim();
                if (!prompt) {
                  errorDiv.textContent = 'Please enter a prompt.';
                  resultDiv.innerHTML = '';
                  return;
                }

                try {
                  // Call the Worker with prompt as a query param
                  const response = await fetch('/?prompt=' + encodeURIComponent(prompt));
                  if (!response.ok) {
                    throw new Error('Failed to generate image');
                  }
                  const blob = await response.blob();
                  const imgUrl = URL.createObjectURL(blob);

                  // Show the generated image
                  resultDiv.innerHTML = '<img src="' + imgUrl + '" alt="Generated Image" />';
                } catch (err) {
                  errorDiv.textContent = err.message;
                  resultDiv.innerHTML = '';
                }
              });
            </script>
          </body>
        </html>
      `;

      return new Response(html, {
        headers: { "content-type": "text/html" },
      });
    }

    // If request has a prompt param, generate image
    const prompt = url.searchParams.get("prompt");
    if (prompt) {
      const inputs = { prompt };

      try {
        const imageResponse = await env.AI.run(
          "@cf/stabilityai/stable-diffusion-xl-base-1.0",
          inputs,
        );

        return new Response(imageResponse, {
          headers: { "content-type": "image/png" },
        });
      } catch (error) {
        return new Response("Error generating image: " + error.message, { status: 500 });
      }
    }

    // Default fallback (optional)
    return new Response("Not found", { status: 404 });
  },
};
