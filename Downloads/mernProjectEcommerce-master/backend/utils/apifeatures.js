class apifeatures {
  constructor(query, queryStr){
      this.query = query;
      this.queryStr = queryStr;

  }


  search() {
      const keyword = this.queryStr.keyword
        ? {
            name: {
              $regex: this.queryStr.keyword,
               //*$ means - match, from beginning to end
              //Provides regular expression capabilities for pattern matching strings in queries
              //To use $regex, use one of the following syntaxes:
              /*
                //  { <field>: { $regex: /pattern/, $options: '<options>' } }
                //  { <field>: { $regex: 'pattern', $options: '<options>' } }
                 // { <field>: { $regex: /pattern/<options> } }
              */
              $options: "i",
            },
          }
        : {};
  
        console.log(keyword);
      this.query = this.query.find({ ...keyword });
      return this;
    }

    filter(){
      const queryCopy = {...this.queryStr}
      console.log(queryCopy);
      //removing some fields for category
      const removeFields = ['keyword','page','limit']
      removeFields.forEach(key=>delete queryCopy[key]);

      // Filter for Price and Rating
      console.log(queryCopy);
      let queryStr = JSON.stringify(queryCopy);
      queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

      this.query = this.query.find(JSON.parse(queryStr));

  return this;
    }

    pagination(resultPerPage) {
      const currentPage = Number(this.queryStr.page) || 1;
  
      const skip = resultPerPage * (currentPage - 1);
  
      this.query = this.query.limit(resultPerPage).skip(skip);
  
      return this;
    }


}


module.exports = apifeatures;