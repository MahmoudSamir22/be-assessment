class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }
  filtering() {
    // 1) Filtering
    const queryStringObject = { ...this.queryString };
    const excludedFilters = ["limit", "page", "sort", "fields", "keyword"];
    excludedFilters.forEach((field) => delete queryStringObject[field]);

    // Making the filtering Query
    let queryStr = JSON.stringify(queryStringObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    return this;
  }
  paginate(countDocuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 20;
    const skip = limit * (page - 1);
    const lastIndex = limit * page;
    let pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocuments / limit);
    if (lastIndex < countDocuments) {
      pagination.nextPage = page + 1;
    }
    if (skip > 0) pagination.skip = page - 1;

    this.paginationResult = pagination;
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else this.mongooseQuery = this.mongooseQuery.select("-__v");
    return this;
  }
  search(modelName) {
    if (this.queryString.keyword) {
      const query = {};
      if (modelName === "Checks") {
        query.$or = [
          { name: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      } 
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }
}

module.exports = ApiFeatures;
