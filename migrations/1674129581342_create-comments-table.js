/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('comments', {});
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};
