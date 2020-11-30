exports.get404 = (req, res, next) => {
  res.status(404).send({
    status: false,
    data: "404 Not Found",
  });
};
