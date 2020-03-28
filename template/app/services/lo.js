export default {
  concatValues(...objs) {
    let values = [];

    objs.forEach(obj => {
      values = values.concat(Object.values(obj));
    });

    return values;
  },
};
