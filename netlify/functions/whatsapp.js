exports.handler = async (event) => {
  const params = new URLSearchParams(event.body || "");
  const message = params.get("Body");

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/xml" },
    body: `
      <Response>
        <Message>
👋 HairStudio Picasso

WhatsApp rezervimi është aktiv ✅
Shkruani "rezervim" për të vazhduar.
        </Message>
      </Response>
    `
  };
};
