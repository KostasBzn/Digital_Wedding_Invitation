const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send({
    success: false,
    error: err.message || "Something went wrong",
  });
};

export default errorHandler;
