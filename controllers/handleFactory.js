const APIFeatures = require('../util/apiFeatures');
const AppError = require('../util/appError');
const catchAsync = require('../util/catchAsync');

const getModelName = Model =>
  Model.collection.modelName.toLowerCase();

const getCollectionName = Model => Model.collection.collectionName;

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { [getModelName(Model)]: doc },
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .select()
      .paginate();

    const docs = await features.queryResult;
    // const docs = await features.queryResult.explain();

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: { [getCollectionName(Model)]: docs },
    });
  });

exports.getOne = (Model, ...populateOptions) =>
  catchAsync(async (req, res, next) => {
    const modelName = getModelName(Model);

    let query = Model.findById(req.params.id);
    populateOptions.forEach(el => {
      query = query.populate(el);
    });

    const doc = await query;

    if (!doc) {
      return next(
        new AppError(`No ${modelName} found with that ID`, 404)
      );
    }

    res.status(200).json({
      status: 'success',
      data: { [modelName]: doc },
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    const modelName = getModelName(Model);

    if (!doc) {
      return next(
        new AppError(`No ${modelName} found with that ID`, 404)
      );
    }

    res.status(200).json({
      status: 'success',
      data: { [modelName]: doc },
    });
  });

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(
        new AppError(
          `No ${getModelName(Model)} found with that ID`,
          404
        )
      );
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
