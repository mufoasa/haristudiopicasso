exports.handler = async (event) => {
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/xml" },
    body: `
<Response>
  <Message>
👋 HairStudio Picasso
WhatsApp rezervimi është aktiv ✅
  </Message>
</Response>
    `
  };
};
