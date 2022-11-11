const { parseQuery } = require('./stringFunctions');

class APIFeatures {
  constructor(queryResult, queryString) {
    this.queryResult = queryResult;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete queryObj[field]);

    const queryStr = JSON.stringify(queryObj).replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}`
    );

    this.queryResult = this.queryResult.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    const sortBy = this.queryString.sort
      ? parseQuery(this.queryString.sort)
      : '-createdAt';

    this.queryResult = this.queryResult.sort(sortBy);

    return this;
  }

  select() {
    const fieldsSelected = this.queryString.fields
      ? parseQuery(this.queryString.fields)
      : '-__v';

    this.queryResult = this.queryResult.select(fieldsSelected);

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skippedResults = (page - 1) * limit;

    this.queryResult = this.queryResult
      .skip(skippedResults)
      .limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
