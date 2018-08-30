let router = {};
export default {
  setRouter(result){ // set a reference to the current router
    router = result;
  },
  getRouter(){ // return the reference to the current router 
    return router;
  }
}
