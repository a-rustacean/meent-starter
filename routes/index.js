const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("index.ejs");
});

router.post("/logout", (request, response) => {
  if (!request.user)
    return response.status(401).json({
      success: false,
      error: {
        message: "Not authenticated",
      },
    });
  request.logout(() => {
    response.status(200).json({
      success: true,
      redirect: "/login",
    });
  });
});

module.exports = router;
