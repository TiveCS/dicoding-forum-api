/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // Menambahkan kolom created_at
  pgm.addColumn('threads', {
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  // Menghapus kolom created_at
  pgm.dropColumn('threads', 'created_at');
};
