function getCookie(req, cookieName) {
  const { cookie } = req.headers;
  if (!cookie) return null;

  const foundValue = cookie.split(";").reduce((res, item) => {
    const c = item.split("=");
    if (c[0] === cookieName) return c[1];
  }, "");

  if (foundValue) return foundValue;
  return null;
}

module.exports = getCookie;
